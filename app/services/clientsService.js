module.exports = (function (db) {
    return {
        getClientBySlug,
    };

    async function getClientBySlug(slug) {

        let client = await db.client
            .findOne({
                where: { slug: slug, active: 1 },
                // raw: true,
                // nest: true,

                include: [
                    {
                        model: db.place,
                        where: { deleted: 0 },
                        include: [
                            // {
                            //     model: db.ordertype,
                            //     attributes: ['id', 'type']
                            // },
                            {
                                model: db.functionality_module,
                                attributes: ['name']
                            }
                        ]
                    }
                ]
            })

        if (!client) return null;

        // client.daaa = 'daaa';
        let resObj = Object.assign({}, {
            id: client.id,
            slug: client.slug,
            places: (() => {
                var placesObj = [];
                client.places.map(place => {
                    placesObj.push(Object.assign(
                        {},
                        {
                            id: place.id,
                            name: place.name,
                            short_name: place.short_name,
                            visible_for_online_orders: place.visible_for_online_orders,
                            active: place.active,
                            image: place.image,
                            priority: place.priority,
                            functionality_modules: place.functionality_modules.map(m => m.name),
                            ordertypes: (() => {
                                var ordertypesObj = [];
                                place.ordertypes.map(
                                    ot => {
                                        ordertypesObj.push(Object.assign(
                                            {},
                                            {
                                                id: ot.id,
                                                type: ot.type
                                            }
                                        ));
                                    }
                                );
                                return ordertypesObj;
                            })()
                        }
                    ))
                });
                return placesObj;
            })(),
        })

        // resObj.da = 'daaa';
        // resObj.places[0].neeeeeee= 'neee'
        // return resObj
        // return resObj;
        // client = null;
        // client = resObj;
        for (let i = 0; i < resObj.places.length; i++) {
            let place = resObj.places[i];
            // return place;

            for (let o = 0; o < resObj.places[i].ordertypes.length; o++) {
                let ordertype = resObj.places[i]['ordertypes'][o];
                // return ordertype;

                resObj.places[i].ordertypes[o].prices = await db.ordertype_price.findAll({ where: { ordertypeId: ordertype.id, placeId: place.id } })
                
                var d = new Date();
                var currDayOfWeek = d.getDay();
                if (currDayOfWeek == 0) { currDayOfWeek = 7; }
                resObj.places[i]['ordertypes'][o]['discounts'] = await db.ordertype_discount.findAll({ where: { 
                        ordertypeId: ordertype.id, 
                        placeId: place.id,
                        activeDaysOfWeek: { 
                            [db.Sequelize.Op.like]: `%"${currDayOfWeek}":1%`
                        }
                    }
                })

            }
        }

        return resObj;
    }
})