// var ErrorManager = require("./../validation/errorsCreator");
const fs = require('fs')
var mkdirp = require('mkdirp');
var Validator = require("./../validation/validator");
var imagesService = require("./../services/imagesService")();
const IMAGES_ROOT = require("./../../config/constants.js")['IMAGES_ROOT'];
const THUMB_IMAGES_ROOT = require("./../../config/constants.js")['THUMB_IMAGES_ROOT'];
const moment = require('moment');

module.exports = (function (app, db, ErrorManager) {
    var checkpointService = require("./../services/checkpointService")(db);

    return {
        listCheckpoints,
        createUpdateCheckpoint
    };
 
    async function listCheckpoints(req, res) {
        let whereObj = {
            deleted: 0,
            placeId: req.cookies.place
        };

        db.checkpoint
        .findAll({
            where: whereObj
        })
        .then(function (checkpoints) {
            var resObj = {};
    
            checkpoints.map(checkpoint => {
                resObj[checkpoint.id] = checkpoint
            });

            res.json(resObj);
        });
    }
    
    async function createUpdateCheckpoint(req, res) {
        if(req.cookies.place) {
            req.body.placeId = req.cookies.place;
        } 

        if (req.body.id) {
            db.checkpoint.findOne({
                where: { id: req.body.id },
            })
            .then(async checkpoint => {
                if (checkpoint == null) {
                    return ErrorManager.handleError(null, res, "No checkpoint with this id found")
                } else {
                    if (req.body.token) {
                        req.body.token = checkpointService.generateRandomToken(checkpoint.id);
                    }
    
                    checkpoint.update(req.body)
                        .then(async result => {
    
                            res.json(result);
                        })
                        .catch(err => {
                            return ErrorManager.handleError(err, res);
                        })
                }
            })
            .catch(err => {
                res.json({ "error": err });
            })

        } else {
            if (!req.body.place_id) {
                return ErrorManager.handleError(null, res, "place_id is required");
            }

            db.checkpoint
                .create({
                    name: req.body.name,
                    placeId: req.body.place_id,
                })
                .then(async checkpoint => {
                    // if(!req.body.table_token && req.body.table_num) {
                    let token = checkpointService.generateRandomToken(checkpoint.id);
    
                    await checkpoint.update({
                        token: token,
                        // url: (req.query.host || 'https://menu.tabl.bg') + req.body.place_url + '/t/' + tableToken
                    }).catch(err => {
                        ErrorManager.handleError(err, res, "");
                    })
    
                    res.json(checkpoint);
                })
                .catch(err => {
                    // res.json( err);return;
    
                    ErrorManager.handleError(err, res, "");
    
                    // res.json({"error":err})
                });
        }
    }


});
