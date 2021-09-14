var db = require("./../../models");

exports.roleAuth = function (minRequiredRole) {

    return async function (req, res, next) {
        var user = req.user;

        let foundUser = await db.user.findOne({
            where: { id: user.id },
            include: db.role
        })

        if (!foundUser) {
            res.status(422).json({ error: 'No user found.' });
            return next('Unauthorized');
        }
        // res.json(foundUser);return;
        // return next(foundUser);
        let currentRole = foundUser.role.name;
        let hasAccess = false;
        switch (minRequiredRole) {
            case 'USER':
                hasAccess = (currentRole == 'USER' || currentRole == 'PLACE_ADMIN' || currentRole == 'CLIENT_ADMIN' || currentRole == 'SUPER_ADMIN');
                break;
            case 'PLACE_ADMIN':
                hasAccess = (currentRole == 'PLACE_ADMIN' || currentRole == 'CLIENT_ADMIN' || currentRole == 'SUPER_ADMIN')
                break;
            case 'CLIENT_ADMIN':
                hasAccess = (currentRole == 'CLIENT_ADMIN' || currentRole == 'SUPER_ADMIN');
                break;
            case 'SUPER_ADMIN':
                hasAccess = (currentRole == 'SUPER_ADMIN')
                break;
            default:
                hasAccess = false;
        }

        if (hasAccess) {
            return next();
        }
        // if(roles.indexOf(foundUser.role.name) > -1){
        //     return next();
        // }

        res.status(401).json('Unauthorized');
        return next('Unauthorized');

    }

}

