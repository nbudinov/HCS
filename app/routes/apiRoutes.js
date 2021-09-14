const rateLimit = require("express-rate-limit");
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 60 minutes
  max: 10 // limit each IP to X requests per windowMs
});
const loginLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 60 minutes
  max: 100 // limit each IP to 100 requests per windowMs
})

var site = "http://localhost:4000";

module.exports = function (app, db, passport) {
  var Auth = require("./../helpers/authentication");                                                    // middleware for doing authentication

  var ErrorManager = require("./../validation/errorsCreator")(db);
  var tasksController = require("./tasksController")(app, db, ErrorManager);
  var checkpointsController = require("./checkpointsController")(app, db, ErrorManager);
  var visitsController = require("./visitsController")(app, db, ErrorManager);
  var placesController = require('./placesController')(app, db, ErrorManager);
  var usersController = require('./usersController')(app, db, ErrorManager);

  var requireAuth = passport.authenticate('headerAuthRule', { session: false })
  var menuAuth = passport.authenticate(['headerAuthRule', 'anonymous'], { session: false });              // routes with this auth allow both logged in and not logged in users

  var languagesController = require('./languagesController');
  var clientsController = require('./clientsController')(app, db, ErrorManager);

  //  CLIENT - TEST ENV ONLY (FOR NOW)
  // най-отгоре за да може да взима на дев енв клиента+Places без да хваща забраните по-долу
  app.get("/api/clients/:slug", clientsController.getAll);

  app.get("/api/clientsAdmin", requireAuth, Auth.roleAuth('PDF_MENU_ADMIN'), clientsController.getAllClientsAdmin);

  // app.get('/api/epay/test', epayController.test);


  app.all("/api/*", menuAuth, (req, res, next) => {
    const exceptionRoutesNotRequiringPlace = [
      "/api/users/login",

      "/api/clients/request-join",
      "/api/data",
      "/api/users/validate",
    ]

    let isException = false;
    for (let i = 0; i < exceptionRoutesNotRequiringPlace.length; i++) {
      if (req.originalUrl.includes(exceptionRoutesNotRequiringPlace[i])) {
        isException = true;
      }
    }

    if (isException) {
      next();
      return;
    }

    if(req.user) {
      if(req.user.role && req.user.role.name == "SUPER_ADMIN") {         // If not super admin, use the user's place. If super admin -> can switch between places
        if(req.headers.place && !req.cookies['place']) {
          req.cookies['place'] = req.headers.place;   // set place cookie for dev env
        } else {
          req.cookies['place'] = req.user.placeId;   // set place cookie for dev env
        }
      } else {
        req.cookies['place'] = req.user.placeId;   // set place cookie for dev env
      }

      next();

    } else {
      next();
      // return res.status(401).json('Unauthorized')
    }
  })


  app.get("/api/userTasks", requireAuth, tasksController.listTasksForUser);
  app.get("/api/tasks", requireAuth, Auth.roleAuth('PLACE_ADMIN'), tasksController.listTasks);
  app.post("/api/tasks", requireAuth, Auth.roleAuth('PLACE_ADMIN'), tasksController.createUpdateTask);

  app.get("/api/checkpoints", requireAuth, Auth.roleAuth('PLACE_ADMIN'), checkpointsController.listCheckpoints);
  app.post("/api/checkpoints", requireAuth, Auth.roleAuth('PLACE_ADMIN'), checkpointsController.createUpdateCheckpoint);

  app.post("/api/visits", requireAuth, visitsController.createVisit);

  app.get("/api/users", requireAuth, Auth.roleAuth('PLACE_ADMIN'), usersController.getUsers);
  app.post("/api/users/edit", requireAuth, Auth.roleAuth('PLACE_ADMIN'), usersController.edit);
  app.post("/api/users/login", loginLimiter, usersController.login);

  app.post("/api/users/register", requireAuth, Auth.roleAuth('PLACE_ADMIN'), usersController.register);

  app.get("/api/users/roles", requireAuth, usersController.getRoles);
  app.post("/api/users/reset-password", menuAuth, usersController.resetPassword);
  

  // ---------- LANGS ----------------
  app.get("/api/languages", languagesController(app, db).getLangs);
  app.post("/api/languages", requireAuth, Auth.roleAuth('SUPER_ADMIN'), languagesController(app, db).createLang);
  app.put("/api/languages/:id", requireAuth, Auth.roleAuth('SUPER_ADMIN'), languagesController(app, db).updateLang);

  // ---------- PLACES ----------------
  app.get("/api/places", requireAuth, Auth.roleAuth('PLACE_ADMIN'), placesController.getPlaces);
  app.post("/api/places", requireAuth, Auth.roleAuth('SUPER_ADMIN'), placesController.handlePlaceCreateUpdate);
  
  // ------------ CLIENTS ----------------
  app.post("/api/clients", requireAuth, Auth.roleAuth('SUPER_ADMIN'), clientsController.createUpdateClient);

};

