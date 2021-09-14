require('dotenv').config();
const fs = require('fs');
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");
const http = require("http");
const https = require("https");
const compression = require('compression');
const fileUpload = require('express-fileupload');
const passport = require("passport");
const cookieParser = require('cookie-parser')

const db = require("./models");
const apiRoutes = require("./app/routes/apiRoutes");
const apiChecks = require("./app/validation/apiChecks");
const cluster = require('cluster');
const helmet = require("helmet");

var PORT = process.env.PORT || 4000;
var SOCKETPORT = process.env.SOCKETPORT || 5000;

app.use(cookieParser())

// Passport middleware
app.use(passport.initialize());
// app.use(passport.session());   // може да ни трябва
// Passport config
require("./config/passport")(passport, db);

app.use(fileUpload());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(helmet({ contentSecurityPolicy: false, }));

// GZIP all assets
app.use(compression());
app.enable('trust proxy');

app.get("/api/db", passport.authenticate('bearer', { session: false }), function (req, res) {
    db.sequelize.sync({ alter: true }).then(function () {
        res.json("Successfully altered DB");
    });
});

// app.get("/api/db_force", passport.authenticate('bearer', { session: false }), function (req, res) {
//     db.sequelize.sync({ alter: true, force: true }).then(function () {
//         res.json("Successfully FORCE altered DB");
//     });
// });

app.get("/api", function (req, res) {
    res.json("Success global ");
});

var server = http.createServer(app);

apiChecks(app);
apiRoutes(app, db, passport);

app.use('/robots.txt', function (req, res, next) {
    res.type('text/plain')
    res.send("User-agent: *\nDisallow: /admin/");
});

app.use('/', express.static(path.join(__dirname, 'admin')))
app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname + '/admin/index.html'))
})
app.use('/files', express.static(path.join(__dirname, 'product_images')));

// const queryInterface = db.sequelize.getQueryInterface();
//     queryInterface.removeIndex('order_productvariants', '`order_productvariants_productVariantId_orderId_unique`')
//       .then(function(){

//   db.sequelize.sync({ alter: true }).then(function() {
server.listen(PORT, function () {
    console.log("LISTENING ", PORT);
});
// });
 