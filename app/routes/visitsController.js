// var ErrorManager = require("./../validation/errorsCreator");
const fs = require('fs')
var mkdirp = require('mkdirp');
var Validator = require("./../validation/validator");
var imagesService = require("./../services/imagesService")();
const moment = require('moment');

module.exports = (function (app, db, ErrorManager) {
    return {
        listTasks,
        createVisit,
    };
 
    async function listTasks(req, res) {
        let whereObj = {
            deleted: 0,
            placeId: req.cookies.place
        };        

        db.task
        .findAll({
            where: whereObj,
            include: [
                {
                    model: db.user,
                    attributes: ['email', 'id']
                }
            ]
        })
        .then(function (tasks) {
            var resObj = {};
            
            tasks.map(t => {
                resObj[t.id] = t;
            })

            res.json(resObj);
        });
    }
    
    async function createVisit(req, res) {
        if(req.cookies.place) req.body.placeId = req.cookies.place; 

        if(!req.body.token) return ErrorManager.handleError(null, res, "Invalid token")
        if(!req.body.taskId) return ErrorManager.handleError(null, res, "Invalid task")

        let tokenOrUrl = req.body.token;
        let token = parseTokenFromTokenOrUrl(tokenOrUrl);

        let checkpoint = await db.checkpoint.findOne({ 
            where: {
                token: token
            }
        })

        if(!checkpoint) return ErrorManager.handleError(null, res, "Invalid checkpoint")

        let task = await db.task.findOne({ 
            where: {
                id: req.body.taskId
            }
        })

        if(!task) return ErrorManager.handleError(null, res, "Invalid task")

        if(task.checkpointId != checkpoint.id) return ErrorManager.handleError(null, res, "Wrong checkpoint for task")

        let visit = await db.visit.create({
            placeId: req.cookies.place,
            checkpointId: checkpoint.id,
            taskId: task.id,
            userId: req.user.id,
            comment: req.body.comment ? req.body.comment : ""
        })

        res.json(visit);

        // if (req.body.id) {
        //     db.task.findOne({ where: { id: req.body.id } })
        //         .then(task => {
        //             if (!task) {
        //                 return ErrorManager.handleError(null, res, "No such task found");
        //             }
                
        //             task.update(
        //                 req.body
        //             )
        //             .then(async updatedTask => {

        //                 if(req.body.usersIds) {
        //                     updatedTask.setUsers(req.body.usersIds);
        //                 }

        //                 res.json(updatedTask);
        //             })
        //             .catch(err => {
        //                 return ErrorManager.handleError("-" + err, res, "");
        //             })
        //         })

        // } else {
            
        //     let task = await db.task.create(
        //         req.body
        //     )

        //     if(req.body.usersIds) {
        //         task.setUsers(req.body.usersIds);
        //     }

        //     return res.json(task);
        // }
    }

    function parseTokenFromTokenOrUrl(tokenOrUrl) {
        const ROUTE_SPLITTER = "/t/";
        var token = "";
        if (tokenOrUrl.includes(ROUTE_SPLITTER)) {
            token = tokenOrUrl.split(ROUTE_SPLITTER)[1];
        } else {
            token = tokenOrUrl;
        }

        return token;
    }

});
