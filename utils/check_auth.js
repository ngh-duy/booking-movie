let jwt = require('jsonwebtoken')
let constants = require('../utils/constants')
let userController = require('../controllers/users')
//slug
module.exports = {
    check_authentication: async function (req, res, next) {
        let token;
        if (!req.header || !req.headers.authorization) {
            //throw new Error("ban chua dang nhap")
            if (req.signedCookies.token) {
                token = req.signedCookies.token;
            }
        } else {
            let authorization = req.headers.authorization;
            if (authorization.startsWith("Bearer")) {
                token = authorization.split(" ")[1];
            }
        }
        if (!token) {
            next(new Error("ban chua dang nhap"))
        } else {
            let result = jwt.verify(token, constants.SECRET_KEY);
            if (result) {
                let id = result.id;
                let user = await userController.GetUserById(id);
                req.user = user;
                next();
            }
        }
    },
    check_authorization: function (requiredRole) {
        return function (req, res, next) {
            let role = req.user.role.name;
            if (requiredRole.includes(role)) {
                next();
            } else {
                throw new Error("ban khong co quyen")
            }
        }
    }
}