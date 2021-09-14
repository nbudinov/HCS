const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("./../../config/keys");
const passport = require("passport");
// Load input validation
const validateRegisterInput = require("./../validation/registerValidator");
const validateLoginInput = require("./../validation/loginValidator");
const Validator = require("validator");
var errorCreator = require("./../validation/errorsCreator");
const request = require('request')
const RECAPTCHA_SECRET = require("./../../config/constants")['RECAPTCHA_SECRET'];

module.exports = function (app, db, ErrorManager) {
	var userService = require('./../services/userService')(db);
	var utils = require('./../services/utilities')(db);
	var mailService = require('./../services/mailService')();

	return {
		register,
		registerMenu,
		edit,
		editProfile,
		login,
		loginMenu,
		getUsers,
		getRoles,
		generateAnonymousUser,
		validateUserToken,
		resetPassword,
	};

	function loginMenu(req, res) {
		const { errors, isValid } = validateLoginInput(req.body);
		// Check validation
		if (!isValid) {
			return res.status(400).json({
				error: errors
			});
		}

		const email = req.body.email;
		const password = req.body.password;

		userService.getUserWithInfoByEmail(email)
		.then(user => {
			
			if (!user) {
				return res
					// .status(404)
					.json({
						error: "Invalid credentials"
					});
			}

			// Check password
			bcrypt.compare(password, user.password).then(isMatch => {
				if (isMatch) {
					// User matched
					// Create JWT Payload
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
						expiresIn: 60 * 60 //1hour   //1200800  // ~2 week in seconds
					},
						(err, token) => {
							res.json({
								success: true,
								token: token,
							});
						}
					);
				} else {
					return res
						// .status(404)
						.json({
							error: "Invalid credentials"
						});
				}
			});
		});
	}

	function login(req, res) {
		const { errors, isValid } = validateLoginInput(req.body);
		if (!isValid) {
			return res.status(400).json({ error: errors });
		}

		const email = req.body.email;
		const password = req.body.password;
		db.user.findOne({
			where: {
				email: email, active: 1, deleted: 0,
			},
			include: [
				{
					model: db.role,
					where: {
						name: {
							[db.Sequelize.Op.in]: ["USER", "PLACE_ADMIN", "CLIENT_ADMIN", "SUPER_ADMIN"]
						}
					}
				},
				{
					model: db.place,
					include: [
						{
							model: db.client
						}
					]
				}
			]
		}).then(user => {
			if (!user) return ErrorManager.handleError(null, res, "Invalid credentials");
			bcrypt.compare(password, user.password).then(isMatch => {
				if (isMatch) {
					const payload = {
						id: user.id,
						email: user.email,
						role: user.role.name,
						roleId: user.role.id,
						place_id: user.placeId,
						client_id: user.place.client.id
					};
					jwt.sign(
						payload,
						keys.secretOrKey, {
						expiresIn: 31556952000 // 1 year
					},
						(err, token) => {
							res.json({
								success: true,
								token: token,
							});
						}
					);
				} else {
					return res
						// .status(404)
						.json({
							error: "Invalid credentials"
						});
				}
			});
		});
	}

	async function register(req, res) {
		let errors = {};
		if (Validator.isEmpty(req.body.email)) {
			errors.email = "Email field is required";
		} else if (!Validator.isEmail(req.body.email)) {
			errors.email = "Email is invalid";
		}
		if (Validator.isEmpty(req.body.password))  errors.password = "Password field is required";
		if (!Validator.isLength(req.body.password, { min: 6, max: 30 })) errors.password = "Password must be at least 6 characters";
		
		if (Object.keys(errors).length > 0) {
			Object.values(errors).map(e => {
				ErrorManager.handleError(null, res, e);
			});

			return;
		}

		let userCheck = await db.user.findOne({
			where: {
				email: req.body.email
			}
		})

		if (userCheck) {
			return ErrorManager.handleError(null, res, "Email already exists");
		}

		if (req.user) {
			let userCreatorRoleId = req.user.roleId;

			if (userCreatorRoleId > req.body.role) {
				return ErrorManager.handleError(null, res, "You don't have permission to create user with higher role");
			}
		}

		bcrypt.genSalt(10, (err, salt) => {
			bcrypt.hash(req.body.password, salt, (err, hash) => {
				if (err) res.json({
					error: err
				});

				db.user
					.create({
						email: req.body.email,
						password: hash,
						roleId: req.body.role,
						placeId: req.body.placeId
					})
					.then(user => {
						res.json(user);
					})
					.catch(err => {
						res.json({
							error: err
						});
					});
			});
		});
	}

	async function registerMenu(req, res) {
		const { errors, isValid } = validateRegisterInput(req.body);

		if (!isValid) {
			// temporary solution; TODO: better implementation needed
			Object.values(errors).map(e => {
				ErrorManager.handleError(null, res, e);
			});
			return;
		}

		let userCheck = await db.user.findOne({
			where: { email: req.body.email }
		})

		if (userCheck) {
			return ErrorManager.handleError(null, res, "Email already exists");
		}

		if (req.body['g-recaptcha-response'] === undefined || req.body['g-recaptcha-response'] === '' || req.body['g-recaptcha-response'] === null) {
			return ErrorManager.handleError(null, res, "Please select captcha");
		}

		// req.connection.remoteAddress will provide IP address of connected user.
		var verificationUrl = "https://www.google.com/recaptcha/api/siteverify?secret=" + RECAPTCHA_SECRET + "&response=" + req.body['g-recaptcha-response'] + "&remoteip=" + req.connection.remoteAddress;
		// Hitting GET request to the URL, Google will respond with success or error scenario.
		request(verificationUrl, async function (error, response, body) {
			body = JSON.parse(body);
			// Success will be true or false depending upon captcha validation.
			if (body.success !== undefined && !body.success) {
				return ErrorManager.handleError(null, res, "Failed captcha verification");
			}

			let userRole = await db.role.findOne({ where: { name: "USER" } }).catch(e => { res.status(400).json("System problem. Please contact us"); return; });

			// TODO anon user id
			let anonUserId = 0;
			if (req.cookies.tabl_user_token) {
				let anonUser = await db.anonymous_user.findOne({ where: { token: req.cookies.tabl_user_token } });
				if (anonUser) {
					anonUserId = anonUser.id;
				}
			}

			bcrypt.genSalt(10, (err, salt) => {
				bcrypt.hash(req.body.password, salt, (err, hash) => {
					if (err) res.json({
						error: err
					});

					db.user
						.create({
							fullname: req.body.fullname,
							phone: req.body.phone,
							email: req.body.email,
							password: hash,
							roleId: userRole.id,
							placeId: null,
							anonymousUserId: anonUserId || null,
							tabl_points: 5
						})
						.then(async user => {

							// Update all orders with this anonUserId and set the new User Id
							if (anonUserId && anonUserId > 0) {
								let ordersResp = await db.order.update(
									{ userId: user.id },
									{ where: { anonymousUserId: anonUserId } }
								);
							}


							res.json("success");
						})
						.catch(err => {
							res.json({
								error: err
							});
						});
				});
			});


		})
	}

	function edit(req, res) {
		if (!req.body.email) {
			return ErrorManager.handleError(null, res, "Email is required");
		}
		db.user.findOne({
			where: {
				id: req.body.id
			}
		}).then(user => {
			if (user) {

				if (!Validator.isEmail(req.body.email)) {
					return ErrorManager.handleError(null, res, "Email is not valid");
				}

				if (typeof req.body.password != "undefined" && req.body.password != "") {
					bcrypt.genSalt(10, (err, salt) => {
						bcrypt.hash(req.body.password, salt, (err, hash) => {
							if (err) return ErrorManager.handleError(err, res, "");

							user.update({
								email: req.body.email,
								password: hash,
								roleId: req.body.role,
								placeId: req.body.placeId
							})
							.then(result => {
								res.json(result);
							})
							.catch(err => {
								ErrorManager.handleError(err, res, "");
							});
						});
					})
				} else {
					user.update({
						email: req.body.email,
						deleted: req.body.deleted,
						active: req.body.active,
						roleId: req.body.role,
						placeId: req.body.placeId
					})
					.then(result => {
						res.json(result);
					})
					.catch(err => {
						ErrorManager.handleError(err, res, "");
					});
				}
			} else {
				ErrorManager.handleError(null, res, "No such user found");
			}
		});
	}

	function editProfile(req, res) {
		if (!req.body.email) {
			return ErrorManager.handleError(null, res, "Email is required");
		}
		
		userService.getUserWithInfoByEmail(req.body.email)
		.then(user => {
			if (user) {				
				if (!Validator.isEmail(req.body.email)) {
					return ErrorManager.handleError(null, res, "Email is not valid");
				}

				if (req.body.password && typeof req.body.password != "undefined" && req.body.password != "") {
					bcrypt.genSalt(10, (err, salt) => {
						bcrypt.hash(req.body.password, salt, (err, hash) => {
							if (err) {
								ErrorManager.handleError(err, res, "");
							}

							user.update({
								email: req.body.email,
								password: hash,
								fullname: req.body.fullname,
								address: req.body.address,
								phone: req.body.phone
							})
							.then(user => {
								userService.signUserToken(user, 1 * 60 * 60)
								.then(token => {
									res.json({
										success: true,
										token: token,
									});
								})
								.catch(err => {
									return ErrorManager.handleError(err, res, "");
								})

								// const payload = {
								// 	id: user.id,
								// 	email: user.email,
								// 	fullname: user.fullname,
								// 	phone: user.phone,
								// 	address: user.address,
								// 	tabl_points: user.tabl_points,
								// 	payment_instruments: user.user_payment_instruments
								// };
								// // Sign token
								// jwt.sign(
								// 	payload,
								// 	keys.secretOrKey, {
								// 	expiresIn: 86400  // 1 day in seconds
								// },
								// 	(err, token) => {
								// 		res.json({
								// 			success: true,
								// 			token: token,
								// 		});
								// 	}
								// );
							})
							.catch(err => {
								return ErrorManager.handleError(err, res, "");
							});
						});
					})
				} else {
					user.update({
						email: req.body.email,
						fullname: req.body.fullname,
						address: req.body.address,
						phone: req.body.phone
					})
					.then(result => {
						userService.signUserToken(user, 15)
						.then(token => {
							res.json({
								success: true,
								token: token,
							});
						})
						.catch(err => {
							return ErrorManager.handleError(err, res, "");
						})

						// const payload = {
						// 	id: user.id,
						// 	email: user.email,
						// 	fullname: user.fullname,
						// 	phone: user.phone,
						// 	address: user.address,
						// 	tabl_points: user.tabl_points,
						// 	payment_instruments: user.user_payment_instruments
						// };
						// // Sign token
						// jwt.sign(
						// 	payload,
						// 	keys.secretOrKey, {
						// 	expiresIn: 86400  // 1 day in seconds
						// },
						// 	(err, token) => {
						// 		res.json({
						// 			success: true,
						// 			token: token,
						// 		});
						// 	}
						// );
					})
					.catch(err => {
						return ErrorManager.handleError(err, res, "");
					});
				}
			} else {
				ErrorManager.handleError(null, res, "No such user found");
			}
		});
	}

	function getUsers(req, res) {
		let clientWhereObj = {};
		let placesRequired = false;
		let whereObj = { deleted: 0 };

		let role = req.user.role.name;

		if (role == "SUPER_ADMIN") {
			//no where -> returns all places
			if (req.query.client_id) { // за филтър в users page-a по клиент -> филтър само за СУПЕР_АДМИНА
				clientWhereObj.id = req.query.client_id;
				placesRequired = true;
			}
		} else if (role == "CLIENT_ADMIN") {
			clientWhereObj.id = req.user.place.clientId;
			placesRequired = true;
		} else if (role == "PLACE_ADMIN") {
			whereObj.placeId = req.user.place.id;
		} else {
			ErrorManager.handleError(null, res, "Unauthorized");
			return;
		}

		db.user
			.findAll({
				where: whereObj,
				include: [
					{
						model: db.place,
						attributes: ['id'],
						// where: placeWhereObj,
						required: placesRequired,
						include: [
							{
								model: db.client,
								attributes: ['id'],
								where: clientWhereObj
							}
						]
					}

				]
			})
			.then(users => {
				var resObj = {};
				users.map(user => {
					resObj[user.id] = Object.assign(
						{},
						{
							id: user.id,
							email: user.email,
							active: user.active,
							roleId: user.roleId,
							placeId: user.placeId
						}
					)
				})

				res.json(resObj);
			});
	}



	function getRoles(req, res) {
		db.role
			.findAll({ where: { name: { [db.Sequelize.Op.not]: 'SUPER_ADMIN' } } })
			.then(roles => {
				var resObj = {};
				// users.map(user => {
				// 	resObj[user.id] = Object.assign(
				// 		{},
				// 		{
				// 			id: user.id,
				// 			email: user.email,
				// 			active: user.active,
				// 		}
				// 	)
				// })

				res.json(roles);
			});
	}

	async function generateAnonymousUser(req, res) {
		let r = await userService.generateAnonymousUser();

		res.json(r)
	}

	function validateUserToken(req, res) {
		// return res.json(req.user);
		if(req.user) {
			res.json(true)
		} else {
			res.json(false)
		}
	}

	async function resetPassword(req, res) {
		if (req.body['g-recaptcha-response'] === undefined || req.body['g-recaptcha-response'] === '' || req.body['g-recaptcha-response'] === null) {
			return ErrorManager.handleError(null, res, "Please select captcha");
		}

		// req.connection.remoteAddress will provide IP address of connected user.
		var verificationUrl = "https://www.google.com/recaptcha/api/siteverify?secret=" + RECAPTCHA_SECRET + "&response=" + req.body['g-recaptcha-response'] + "&remoteip=" + req.connection.remoteAddress;
		// Hitting GET request to the URL, Google will respond with success or error scenario.
		request(verificationUrl, async function (error, response, body) {
			body = JSON.parse(body);
			// Success will be true or false depending upon captcha validation.
			if (body.success !== undefined && !body.success) {
				return ErrorManager.handleError(null, res, "Failed captcha verification");
			}

			
			let user = await db.user.findOne({
				where: { email: req.body.email }
			})

			if (!user) {
				return res.json("success"); // Even if there is no such profile, return success for security reasons
				// return ErrorManager.handleError(null, res, "No user found with this email");
			}

			let newPass = utils.generateOnlyRandomToken(12);

			bcrypt.genSalt(10, (err, salt) => {
				bcrypt.hash(newPass, salt, async (err, hash) => {
					if (err) res.json({
						error: err
					});

					await user.update({
						password: hash
					})

					mailService.sendMailTemplate("reset_password", user.email, {
						user: user,
						new_password: newPass,
						// host: HOST
					});

					res.json("success");
				})
			})


		})

	}


};