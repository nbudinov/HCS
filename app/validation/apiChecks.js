const cors = require("cors");
const ENV_CHECKS = require("./../../config/constants")['ENV_CHECKS'];

module.exports = function (app, db) {
    const ALLOWED_ORIGINS = ['http://localhost:3000', 'http://localhost:3001']
    // const corsOptions = {
    //     origin: function (origin, callback) {
    //         if (whitelist.indexOf(origin) !== -1) {
    //             callback(null, true)
    //         } else {
    //             callback(new Error('Not allowed by CORS'))
    //         }
    //     },
    // }

    var corsOptions = {
        origin: ALLOWED_ORIGINS,
        optionsSuccessStatus: 200 // For legacy browser support
    }
    // app.use(cors(corsOptions), (req, res, next) => {
    //     let origin = req.headers.origin;
    //     let theOrigin = (ALLOWED_ORIGINS.indexOf(origin) >= 0) ? origin : ALLOWED_ORIGINS[0];
    //     res.header("Access-Control-Allow-Origin", theOrigin);
    //     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    //     next();
    // })


    app.use(cors(corsOptions))

    // app.use(function(req, res, next) {
    //     res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    //     res.setHeader('Access-Control-Allow-Credentials',true);

    //     // res.header('Access-Control-Allow-Origin', 'http://localhost:3000/');
    //     // res.header('Access-Control-Allow-Credentials', true);
    //     // res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    //     next();
    // });

    // Basic security (same as cors but actually working :D)
    app.all("/api/*", (req, res, next) => {
        let allowedHosts = ['localhost:4000', 'localhost:3000', 'localhost:3001',];
        // return res.json(allowedHosts.indexOf(req.headers.host));
        // return res.json(req.headers);
        // if (!req.headers.origin) return next();

        // if (allowedHosts.indexOf(req.headers.host) === -1 ) {
        //     return res.status(400).json("Unauthorized1");
        // } else if (!req.headers['tabl']) {
        //     return res.status(400).json("Unauthorized2");
        // } else {
        //     next();
        // }

        if ((allowedHosts.indexOf(req.headers.host) !== -1 ) ) {
            next();
        } else {
            return res.status(400).json("Unauthorized12");
        }

    })

    // ENV variables check
    app.get("*", function (req, res, next) {
        if (process.env.NODE_ENV === 'production') {
            for (let i = 0; i < ENV_CHECKS.length; i++) {
                let e = ENV_CHECKS[i];
                if (!process.env[e]) {
                    return res.status(400).json({ "error": "Env not configured" });
                }
            }

            if (req.secure) {
                // request was via https, so do no special handling
                next();
            } else {
                // request was via http, so redirect to https
                res.redirect('https://' + req.headers.host + req.url);
            }
        } else {
            next();
        }
    });

}