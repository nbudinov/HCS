const SPOT_SESSION_EXPIRE_TIME_MIN = require("./../../config/constants.js")['SPOT_SESSION_EXPIRE_TIME_MIN'];
const DELIVERY_AND_PICKUP_SESSION_EXPIRE_TIME_MIN = require("./../../config/constants.js")['DELIVERY_AND_PICKUP_SESSION_EXPIRE_TIME_MIN'];
var crypto = require('crypto');
const jwt = require("jsonwebtoken");
const keys = require("./../../config/keys");

const https = require('https');

module.exports = (function (db) {
    return {
        generateAnonymousUser,
        addTablPoints,
        getUserWithInfoByEmail,
        signUserToken
    };

    function getUserWithInfoByEmail(email) {
        return db.user.findOne({
			where: { email },
			include: [
				{
					model: db.role,
				},
				{
					model: db.place,
					include: [
						{
							model: db.client
						}
					]
				},
				{
					model: db.user_payment_instrument,
					attributes: ['id', 'name']
				}
            ]
        });
    }

    async function generateAnonymousUser(ip) {
        const tokenLen = 16;
        // let lastUser = await db.user.findAll({
        //         limit: 1,
        //         order: [
        //         // Will escape full_name and validate DESC against a list of valid direction parameters
        //         ['id', 'DESC']]
        //     });
            // return lastUser
        // res.json(lastUser);return
        
        let uniqueToken = crypto.randomBytes(Math.ceil(tokenLen/2)).toString('hex').slice(0,tokenLen); 
        uniqueToken += new Date().getTime()
        uniqueToken += crypto.randomBytes(Math.ceil(tokenLen/2)).toString('hex').slice(0,tokenLen);

        await db.anonymous_user.create({
            token: uniqueToken,
            ip: ip
        });

        return uniqueToken;
    }

    async function addTablPoints(req) {
        if(req.user && req.user.id) {
            await db.user.update(
                { tabl_points: db.Sequelize.literal('tabl_points + 1') },
                { where: { id: req.user.id } }
            )
        }
    }

    async function signUserToken(user, expirationSeconds) {

        return new Promise(async (resolve, reject) => {
            let u = await db.user.findOne({
                where: {
                    id: user.id,
                },
                include: [
                    {
                        model: db.user_payment_instrument,
                        attributes: ['id', 'name']
                    }
                ]
            })
            user = u;

            const payload = {
                id: user.id,
                email: user.email,
                fullname: user.fullname,
                phone: user.phone,
                address: user.address,
                tabl_points: user.tabl_points,
                payment_instruments: user.user_payment_instruments
            };
            // Sign token
            jwt.sign(
                payload,
                keys.secretOrKey, {
                expiresIn: expirationSeconds //86400  // 1 day in seconds
            },
                (err, token) => {
                    if(err) reject(err);

                    resolve(token);
                }
            );
        })
    }

});