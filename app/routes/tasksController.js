// var ErrorManager = require("./../validation/errorsCreator");
const fs = require('fs')
var mkdirp = require('mkdirp');
var Validator = require("./../validation/validator");
var imagesService = require("./../services/imagesService")();
const IMAGES_ROOT = require("./../../config/constants.js")['IMAGES_ROOT'];
const THUMB_IMAGES_ROOT = require("./../../config/constants.js")['THUMB_IMAGES_ROOT'];
const moment = require('moment');

module.exports = (function (app, db, ErrorManager) {
    return {
        listTasks,
        createUpdateTask,
        listTasksForUser
    };
 
    async function listTasks(req, res) {
        let whereObj = {
            deleted: 0,
            placeId: req.cookies.place
        };        

        let visitWhere = {};
        if(req.query.date) {
            visitWhere.createdAt = { 
                [db.Sequelize.Op.gt] : moment(req.query.date).format('YYYY-MM-DD 00:00'),
                [db.Sequelize.Op.lte] : moment(req.query.date).format('YYYY-MM-DD 23:59')
            }
        }

        let userWhere = {};
        if(req.query.userId) {
            userWhere.id = req.query.userId
        }

        db.task
        .findAll({
            where: whereObj,
            include: [
                {
                    model: db.user,
                    attributes: ['email', 'id'],
                    where: userWhere
                },
                {
                    model: db.checkpoint,
                    where: {
                        deleted: 0
                    }
                },
            ]
        })
        .then(async function (tasks) {
            var resObj = {};
            
            for(let tInd = 0; tInd < tasks.length; tInd++) {
                let t = tasks[tInd];

                for(let i = 0; i < t.users.length; i++) {

                    let visitsForCurrTask = await db.visit.findAll({
                        where: {
                            placeId: t.checkpoint.placeId,
                            checkpointId: t.checkpoint.id,
                            taskId: t.id,
                            userId: t.users[i].id,
                            createdAt: { 
                                [db.Sequelize.Op.gt] : moment(req.query.date).format('YYYY-MM-DD 00:00'),
                                [db.Sequelize.Op.lte] : moment(req.query.date).format('YYYY-MM-DD 23:59')
                            }
                        }
                    })

                    t.users[i].setDataValue('visits', visitsForCurrTask)
                }

                if (t.rotation_start_date && t.rotation_days_count) {
                    let currDate = moment();
                    if(req.query.date) {
                        currDate = moment(req.query.date);
                    }

                    const difference = (currDate).diff(moment(t.rotation_start_date), 'days'); // Or d.diff(date) depending on what you're trying to find

                    if (difference % t.rotation_days_count == 0) {
                        resObj[t.id] = t;
                    }
                } else {
                    resObj[t.id] = t;
                }

                // resObj[t.id] = t;
            }

            res.json(resObj);
        });
    }

    async function listTasksForUser(req, res) {
        let whereObj = {
            deleted: 0,
            placeId: req.cookies.place
        };

        let checkpointWhere = { deleted: 0 };
        if(req.query.token) {
            checkpointWhere.token = req.query.token;
            // return ErrorManager.handleError(null, res, 'Invalid token')
        }

        db.task
        .findAll({
            where: whereObj,
            include: [
                {
                    model: db.user,
                    attributes: ['email', 'id'],
                    where: {
                        id: req.user.id
                    }
                },
                {
                    model: db.checkpoint,
                    where: checkpointWhere,
                },
                {
                    model: db.visit,
                    where: {
                        createdAt : { 
                            [db.Sequelize.Op.gt] : moment().format('YYYY-MM-DD 00:00'),
                            [db.Sequelize.Op.lte] : moment().format('YYYY-MM-DD 23:59')
                        },
                        userId : req.user.id
                    },
                    required: false
                }
            ]
        })
        .then(function (tasks) {
            var resObj = {};
            
            tasks.map(t => {
                if(t.visits.length > 0) {
                    t.setDataValue('completed', true);
                } else {
                    t.setDataValue('completed', false);
                }
                t.setDataValue('today', moment().format('YYYY-MM-DD 00:00'));

                if (t.rotation_start_date && t.rotation_days_count) {
                    let currDate = moment();
                    const difference = (currDate).diff(moment(t.rotation_start_date), 'days'); // Or d.diff(date) depending on what you're trying to find

                    if (difference % t.rotation_days_count == 0) {
                        resObj[t.id] = t;
                    }
                } else {
                    resObj[t.id] = t;
                }

                // resObj[t.id] = t;
            })

            res.json(resObj);
        });
    }
    
    async function createUpdateTask(req, res) {
        if(req.cookies.place) {
            req.body.placeId = req.cookies.place;
        } 

        if (req.body.id) {
            db.task.findOne({ where: { id: req.body.id } })
                .then(task => {
                    if (!task) {
                        return ErrorManager.handleError(null, res, "No such task found");
                    }
                
                    task.update(
                        req.body
                    )
                    .then(async updatedTask => {

                        if(req.body.usersIds) {
                            updatedTask.setUsers(req.body.usersIds);
                        }

                        res.json(updatedTask);
                    })
                    .catch(err => {
                        return ErrorManager.handleError("-" + err, res, "");
                    })
                })

        } else {
            
            let task = await db.task.create(
                req.body
            )

            if(req.body.usersIds) {
                task.setUsers(req.body.usersIds);
            }

            return res.json(task);
        }
    }


});
