// var ErrorManager = require("./../validation/errorsCreator");
const fs = require('fs')
var mkdirp = require('mkdirp');
var Validator = require("./../validation/validator");
var imagesService = require("./../services/imagesService")();
const IMAGES_ROOT = require("./../../config/constants.js")['IMAGES_ROOT'];
const PLACE_IMAGES_ROOT = require("./../../config/constants.js")['PLACE_IMAGES_ROOT'];
const THUMB_IMAGES_ROOT = require("./../../config/constants.js")['THUMB_IMAGES_ROOT'];

module.exports = (function (app, db, ErrorManager) {

    return {
        getPlaces,
        handlePlaceCreateUpdate,
        uploadPlaceImage,
        addPlaceOrdertype,
        removePlaceOrdertype,
        addPlaceFunctionalityModule,
        removePlaceFunctionalityModule,
        getPlacesForMap,
        
        getOrderTypes
    };
    
    function getPlaces(req, res) {

        let whereObj = {
            deleted: 0
        };

        if(req.user) {
            let role = req.user.role.name;

            if(role == "SUPER_ADMIN") {
                //no where -> returns all places
            } else if(role == "CLIENT_ADMIN") {
                whereObj.clientId = req.user.place.clientId;
            } else {
                whereObj.id = req.user.place.id;
            }
        } else {
            res.status(401).json("Unauthorized");
        }


        db.place
        .findAll({
            where: whereObj,
        })
        .then(function (places) {
            var resObj = {};
    
            res.json(places);
        });
    }
  
    function getOrderTypes(req, res) {
        db.ordertype
        .findAll()
        .then(function (types) {
            var resObj = {};
            types.map(t => {
                resObj[t.id] = t;
            })
            res.json(resObj);
        });
    }
        
    function handlePlaceCreateUpdate(req, res) {

        if(!req.body.id) {
            db.place
                .create(req.body)
                .then(async place => {

                    if(req.body.tagsIds) { 
                        if(typeof(req.body.tagsIds) === 'string' && req.body.tagsIds != "") {
                            req.body.tagsIds = JSON.parse(req.body.tagsIds);
                        }
                        await place.setTags(req.body.tagsIds || []);
                    }

                    if(req.files && req.files.file) {
                        let imgResp = await imagesService.uploadImage(req.files.file, PLACE_IMAGES_ROOT, "", true)
                        if (imgResp && imgResp.success) {
                            let imgName = imgResp.payload.imgName;
                            await place.update({
                                image: imgName
                            })
                        } else {
                            return ErrorManager.handleError(null, res, imgResp);
                        }
                    }

                    res.json(place);
                })
                .catch(err => {
                    return res.status(400).json(" -" +err)

                    ErrorManager.handleError(err, res, "");
                    // res.status(400).json({error: err});
                });
        } else {
            db.place.findOne(
                { where: {id: req.body.id} }
            )
            .then(function (place) {
                if(place) { // UPDATE
                    place
                    .update(req.body)
                    .then(async result => {

                        if(req.body.tagsIds) { 
                            if(typeof(req.body.tagsIds) === 'string' && req.body.tagsIds != "") {
                                req.body.tagsIds = JSON.parse(req.body.tagsIds);
                            }
                            await place.setTags(req.body.tagsIds || []);
                        }

                        if(req.files && req.files.file) {
                            let imgResp = await imagesService.uploadImage(req.files.file, PLACE_IMAGES_ROOT, "", true)
                            if (imgResp && imgResp.success) {
                                let imgName = imgResp.payload.imgName;
                                await place.update({
                                    image: imgName
                                })
                            } else {
                                return ErrorManager.handleError(null, res, imgResp);
                            }
                        }
                        
                        res.json(result);
                    })
                    .catch(err => {
                        return res.status(400).json(" -" +err)
                        ErrorManager.handleError(err, res, "");
                    });
                } 
            })
        }

        
    }
    
    function uploadPlaceImage(req, res) {
        if (!req.files || Object.keys(req.files).length == 0 || !req.files.file) {
            ErrorManager.handleError(err, res, "No files were uploaded");
            return;
        }   
        var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

        if(!req.body.place_id) {
            ErrorManager.handleError(null, res, "error place");
            return;
        }
        const placePrefix = "pl_";
        const sharp = require('sharp');

        let sampleFile = req.files.file;
        var d = new Date();
        let parts = sampleFile.name.split(".");

        let imgName = placePrefix;
        imgName += sampleFile.md5 ? sampleFile.md5 : parts[0];
        let ext = parts[parts.length-1];

        // if (!Validator.isAllowedFile(sampleFile.mimetype)) {
        //     ErrorManager.handleError(null, res, sampleFile.mimetype + " not allowed.");
        //     // res.status(400).json(ErrorManager.createErrors([sampleFile.mimetype + " not allowed."]));
        //     return;
        // }

        imgName += d.getTime() + "." + ext;
        
        let path = IMAGES_ROOT;
        let imgPath = path + imgName;

        mkdirp(path).then(made => {
            
            sampleFile.mv(imgPath, function(err) {
                if (err) return res.status(500).send(err);

                imagesService.compressImageForThumb(imgName);

                db.place_image
                .create({
                    path: imgName,
                    placeId: req.body.place_id
                })
                .then(img => {
                    res.json({payload: {success: true}});
                    // res.send(img);
                })
                .catch(err => {
                    ErrorManager.handleError(err, res, "");
                })

            });
        });
    }

    function addPlaceOrdertype(req, res) {
        if(!req.body.place_id || !req.body.ordertype_id){ 
            ErrorManager.handleError(null, res, "place_id and ordertype_id required");
        }

        db.place
            .findOne({where : { id: req.body.place_id }})
            .then(product => {
                if(!product) {
                    ErrorManager.handleError(null, res, "Invalid place_id");
                    return;
                }

                db.ordertype
                .findOne({where : { id: req.body.ordertype_id }})
                .then(ordertype => {
                    if(!ordertype) {
                        ErrorManager.handleError(null, res, "Invalid ordertype_id");
                        return;
                    }

                    product.addOrdertype(ordertype)
                    .then(result => {
                        res.json({"payload":{"success": true}})
                        // db.product.findOne({
                        //     where: { id: req.body.product_id },
                        //     include: db.allergen
                        // })
                        // .then(prodWithAllergen => {
                        //     res.status(200).json(prodWithAllergen)                          
                        // })                          
                    })
                    .catch(error => {
                        ErrorManager.handleError(error, res, "");
                        return;
                    });
                    
                });
        })
    }

    function removePlaceOrdertype(req, res) {
        if(!req.body.place_id || !req.body.ordertype_id){ 
            ErrorManager.handleError(null, res, "place_id and ordertype_id required");
        }

        db.place
            .findOne({where : { id: req.body.place_id }})
            .then(product => {
                if(!product) {
                    ErrorManager.handleError(null, res, "Invalid place_id");
                    return;
                }

                db.ordertype
                .findOne({where : { id: req.body.ordertype_id }})
                .then(ordertype => {
                    if(!ordertype) {
                        ErrorManager.handleError(null, res, "Invalid ordertype_id");
                        return;
                    }

                    product.removeOrdertype(ordertype)
                    .then(result => {
                        res.json({"payload":{"success": true}})
                    })
                    .catch(error => {
                        ErrorManager.handleError(error, res, "");
                        return;
                    });
                    
                });
        })
    }

    function addPlaceFunctionalityModule(req, res) {
        if(!req.body.place_id || !req.body.module_id ){ 
            return ErrorManager.handleError(null, res, "place_id and module_id required");
        }

        db.place
            .findOne({where : { id: req.body.place_id }})
            .then(place => {
                if(!place) {
                    return ErrorManager.handleError(null, res, "Invalid place_id");
                }

                db.functionality_module
                .findOne({where : { id: req.body.module_id }})
                .then(functionalityModule => {
                    if(!functionalityModule) {
                        return ErrorManager.handleError(null, res, "Invalid module_id");
                    }

                    place.addFunctionality_module(functionalityModule, { through: { price: req.body.price || 0 } })
                    .then(result => {
                        res.json({"payload":{"success": true}})
                    })
                    .catch(error => {
                        return ErrorManager.handleError(error, res, "");
                    });
                    
                });
        })
    }

    function removePlaceFunctionalityModule(req, res) {
        if(!req.body.place_id || !req.body.module_id){ 
            return ErrorManager.handleError(null, res, "place_id and module_id required");
        }

        db.place
            .findOne({where : { id: req.body.place_id }})
            .then(place => {
                if(!place) {
                    return ErrorManager.handleError(null, res, "Invalid place_id");
                }

                db.functionality_module
                .findOne({where : { id: req.body.module_id }})
                .then(functionalityModule => {
                    if(!functionalityModule) {
                        return ErrorManager.handleError(null, res, "Invalid module_id");
                    }

                    place.removeFunctionality_module(functionalityModule)
                    .then(result => {
                        res.json({"payload":{"success": true}})
                    })
                    .catch(error => {
                        return ErrorManager.handleError(error, res, "");
                    });
                    
                });
        })
    }

    function getPlacesForMap(req, res) {

        let whereObj = {
            deleted: 0,
            visible_on_map: 1,
        };

        let cityWhere = {};
        let cityRequired = false
        if (req.body.cityId) {
            cityWhere.id = req.body.cityId;
            cityRequired = true;
        }

        let tagWhere = {};
        let tagRequired = false
        if (req.body.tagIds && req.body.tagIds.length > 0) {
            tagWhere.id = req.body.tagIds;
            tagRequired = true;
        }

        db.place
        .findAll({
            where: whereObj,
            attributes: ['id', 'name', 'image', 'lat', 'lng'],
            include: [
                {
                    model: db.client,
                    attributes: ['slug'],
                    where: { verified: 1 },
                    required: true
                },
                {
                    model: db.city,
                    attributes: ['id', 'name'],
                    where: cityWhere,
                    required: cityRequired
                },
                {
                    model: db.tag,
                    attributes: ['id', 'name'],
                    where: tagWhere,
                    required: tagRequired
                },
                {
                    model: db.functionality_module,
                    attributes: ['id', 'name']
                }

            ]
        })
        .then(async function (places) {
            var resObj = {};
            let placesIds = places.map(p => p.id);
            
            let tagsByPlaces = await db.place.findAll({
                where: { id: placesIds },
                attributes: ['id', 'name'],
                include: [
                    {
                        model: db.tag,
                        attributes: ['id', 'name'],
                        required: true,
                        // raw: true
                    },

                ],
            })

            let tagsByPlacesObj = {};
            tagsByPlaces.map(t => {
                tagsByPlacesObj[t.id] = t.tags
            })

            for(let i = 0; i < places.length; i++) {
                let p = places[i];
                
                resObj[p.id] = Object.assign({}, {
                    id: p.id,                    
                    city: p.city,
                    slug: p.client && p.client.slug || "",
                    image: p.image, 
                    lat: p.lat,
                    lng: p.lng, 
                    name: p.name,
                    tags: tagsByPlacesObj[p.id], //placeTags,
                    functionality_modules: p.functionality_modules.map(f => f.name) 
                });
            }
            

            res.json(resObj);
        });
    }

});
