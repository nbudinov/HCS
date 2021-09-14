const slugify = require('slugify');
const request = require('request')
const RECAPTCHA_SECRET = require("./../../config/constants")['RECAPTCHA_SECRET'];

module.exports = (function (app, db, ErrorManager) {
    
    var clientsService = require("./../services/clientsService")(db);
    var mailService = require('./../services/mailService')(db);
    
    return {
        getAllClientsAdmin,
        getAll,
        createUpdateClient,
    };


    async function getAllClientsAdmin(req, res) {
        // res.json(req.params);return;
        let whereObj = {};
        let attributes = [];
        if(req.user) {
            let role = req.user.role.name;

            if(role == "SUPER_ADMIN") {
                //no where -> returns all clients
                
                attributes = [
                    "id", "active", "additional_info", "address", "contract_start_date", "createdAt", "email", "monthly_fee", "name", "owner_name", "phone", "place_type", "slug", "trial_end_date", "trial_start_date", "updatedAt", "verified",
                ];

            } else {
                whereObj.id = req.user.place.clientId;
                attributes = ['id', 'name', 'slug']
            }
        } else {
            res.status(401).json("Unauthorized");
        }

        let clients = await db.client.findAll({
            where: whereObj,
            attributes: attributes
        });
        
        res.json(clients);
    
    }

    async function getAll(req, res) {
        let client = await clientsService.getClientBySlug(req.params.slug);

        if(client) {
            res.json(client);
        } else {
            res.json(null);
        }
    
    }

    function createUpdateClient(req, res) {
        // if(!req.body.place_id) {
        //     ErrorManager.handleError(null, res, "place_id required");
        // }
        if(req.body.id) {
            db.client.findOne( {where: {id: req.body.id}} )
            .then(cl => {
                if(!cl) {
                    ErrorManager.handleError(null, res, "No such client found");
                    return;
                }
                // req.body.parentId = req.body.parentId == 0 ? null : req.body.parentId;

                cl.update(req.body)
                .then(updatedClient => {
                    res.json(updatedClient);
                })
                .catch(err => {
                    ErrorManager.handleError(err, res, "");
                })
            })
        } else {
            db.client
            .create(req.body)
            .then(async(cl) =>  {
                // await cl.addPlaces([req.body.place_id]);
                res.json(cl);
            })
            .catch(err => {
                res.status(400).json({error: err});
            });
        }
    }

});


