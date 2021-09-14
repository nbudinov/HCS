var md5 = require('md5');
// const SESSION_EXPIRE_TIME_MIN = require("./../../config/constants.js")['SESSION_EXPIRE_TIME_MIN'];
const SPOT_SESSION_EXPIRE_TIME_MIN = require("./../../config/constants.js")['SPOT_SESSION_EXPIRE_TIME_MIN'];
const DELIVERY_AND_PICKUP_SESSION_EXPIRE_TIME_MIN = require("./../../config/constants.js")['DELIVERY_AND_PICKUP_SESSION_EXPIRE_TIME_MIN'];
var crypto = require('crypto');

module.exports = (function (db) {
    return {
        generateTableWithToken,
        getTable,
        getTableByToken,
        generateTableSession,
        generateSession,
        getValidSession,
        updateSessionsByTableId,
        getSession,
        generateRandomToken,
        getAllUserNeedsForSocket,
        getTableWithPlaceAndOrdertypeByToken,
        verifyTableResponseByOrdertype
    };


    async function getAllUserNeedsForSocket(placeId) {
        // if (!placeId) {
        //     // ErrorManager.handleError(null, res, "place_id is required");
        //     // return;
        //     return "place_id is required";
        // }

        let uNeeds = await db.table
            .findAll({
                where: {
                    deleted: 0,
                    placeId: placeId
                },
                include: [
                    {
                        model: db.table_userneeds,
                        where: {
                            status: "pending",
                            deleted: 0,
                        },
                        // attributes: [ 'id',  ],
                        include: [
                            {
                                model: db.userneed,
                                // where: { placeId: req.query.place_id },
                            },

                        ],
                    }
                ]
            });

        return uNeeds;
    }


    
    function getTable(id) {
        return db.table
            .findOne({
                where: { deleted: 0, id: id },
            })
    }

    function getTableByToken(token) {
        return db.table
            .findOne({
                where: { deleted: 0, table_token: token },
            })
    }

    async function generateTableWithToken(type) {
        return db.table
            .findOne({
                where: { deleted: 0 },
                order: [
                    ['id', 'DESC']
                ]
            })
            .then(async table => {
                if (!table) {
                    var tableNum = 1 + type; //(md5(1 + new Date));
                    var tableToken = md5(md5(tableNum + (new Date)));
                } else {
                    var tableNum = table.id * 1 + 1 + type; // md5(md5((table.id++) + new Date));
                    var tableToken = md5(md5(tableNum + (new Date)));
                }

                let newTable = {
                    table_num: tableNum,
                    table_token: tableToken,
                    qr_code_image: "",
                }

                let createdTable = await db.table.create(newTable);

                let orderType = await db.ordertype.findOne({ where: { type: type } })

                if (!orderType) throw new Error("No ordertype " + type);

                await createdTable.addOrdertype(orderType);

                return createdTable;
                // .then(table => {
                //     res.json({token: tableToken});
                // })
                // .catch(err => {
                //     res.json({"error":err})
                // });
            });
    }

    async function generateTableSession(table, order_type = "delivery") {
        let uniqueSession = table.table_token + (+ new Date)
        let sessionExpireTime = order_type == "delivery" ? DELIVERY_AND_PICKUP_SESSION_EXPIRE_TIME_MIN : SPOT_SESSION_EXPIRE_TIME_MIN;
        // res.json(uniqueSession);return;
        return db.session
            .create({
                "session": uniqueSession,
                "tableId": table.id,
                "expire_time": new Date(Date.now() + (sessionExpireTime * 60 * 1000))
            })

    }

    async function generateSession(order_type = 'delivery', table = null) {
        let uniqueSession = generateRandomToken(null, 12) + (+ new Date);
        let sessionExpireTime = order_type == "delivery" || order_type == "preorder" || order_type == "room"
            ? DELIVERY_AND_PICKUP_SESSION_EXPIRE_TIME_MIN : SPOT_SESSION_EXPIRE_TIME_MIN;

        return db.session
            .create({
                "session": uniqueSession,
                "tableId": table == null ? null : table.id,
                "expire_time": new Date(Date.now() + (sessionExpireTime * 60 * 1000))
            })
    }

    async function getValidSession(sessionToken, order_type = 'delivery') {
        let sessionExpireTime = order_type == "delivery" || order_type == "preorder" || order_type == "room" ? DELIVERY_AND_PICKUP_SESSION_EXPIRE_TIME_MIN : SPOT_SESSION_EXPIRE_TIME_MIN;

        return db.session
            .findOne({
                where: {
                    session: sessionToken,
                    createdAt: { [db.Sequelize.Op.gte]: new Date(new Date() - sessionExpireTime * 60 * 1000) }
                },
                include: [
                    {
                        model: db.table,
                    }
                ]
            })
    }

    async function updateSessionsByTableId(tableId, session) {
        return db.session.update(
            session,
            { where: { "tableId": tableId } }
        )
    }

    async function getSession(session) {
        return db.session
            .findOne({
                where: { session: session },
                include: [
                    {
                        model: db.table,
                    }
                ]
            })
    }

    function isSessionValid(sessionToken) {
        return db.session
            .findOne({
                where: {
                    session: session,
                    createdAt: { [db.Sequelize.Op.gte]: new Date(new Date() - SESSION_EXPIRE_TIME_MIN * 60 * 1000) }
                }
            })
            .then(s => {
                if (s) {
                    return true;
                } else {
                    return false;
                }
            })
    }

    function generateRandomToken(tableNumOrId = null, tokenLen = 8) {
        if (tableNumOrId == null) {
            tableNumOrId = "";
            tokenLen += 2;
        }

        let rand = crypto.randomBytes(Math.ceil(tokenLen / 2))
            .toString('hex') // convert to hexadecimal format
            .slice(0, tokenLen); //.toUpperCase();

        return tableNumOrId + rand
    }

    function getTableWithPlaceAndOrdertypeByToken(token, placeWhere = {}, clientWhere = {}) {

        return db.table
        .findOne({
            where: {
                deleted: 0,
                active: 1,
                table_token: token
            },
            include: [
                {
                    model: db.place,
                    where: placeWhere,
                    include: [
                        {
                            model: db.ordertype,
                            where: {
                                [db.Sequelize.Op.or]: [
                                    { type: "spot" },
                                    { type: "spot_browse" },
                                    { type: "delivery" },
                                    { type: "preorder" },
                                    { type: "tablet_mode" },
                                    { type: "room" },
                                ]
                            },
                            required: true
                        },
                        {
                            model: db.client,
                            attributes: [],
                            where: clientWhere,
                            required: true
                        }
                    ],
                    required: true
                },
                {
                    model: db.ordertype
                }
            ]
        });
    }

    async function verifyTableResponseByOrdertype(table, res) {

        let ordertype = table.ordertypes[0]; //.map(ot => ot.id);
        // let spotOT = table.place.ordertypes.find(ot => ot.type == "spot");
        if (ordertype && (ordertype.type == "spot_browse" || ordertype.type == "tablet_mode")) {
            // let uniqueSession = table.table_token + (+ new Date)
            res.json({ "payload": { "session": null, "place_id": table.placeId, ordertype: ordertype.id } });

        } else if(ordertype && ordertype.type == "room") {
            let session = await this.generateSession(ordertype.type, table)
            res.json({ "payload": { "session": session.session, "place_id": table.placeId, ordertype: ordertype.id, room_number: table.table_num } });

        } else {
            let session = await this.generateSession(ordertype.type, table)
            res.json({ "payload": { "session": session.session, "place_id": table.placeId, ordertype: ordertype.id } });
        }
    }
})