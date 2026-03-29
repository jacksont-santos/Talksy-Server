"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
var jwt_1 = require("../utils/jwt");
var AppError_1 = require("../utils/AppError");
var authMiddleware = function (req, res, next) {
    var authorization = req.headers.authorization;
    if (!authorization)
        throw new AppError_1.AppError(401, 'Authorization header is missing');
    var user = (0, jwt_1.verifyToken)(authorization);
    if (!user)
        throw new AppError_1.AppError(401, 'Invalid token');
    req.headers.userData = { _id: user._id, username: user.username };
    next();
};
exports.authMiddleware = authMiddleware;
//# sourceMappingURL=authMiddleware.js.map