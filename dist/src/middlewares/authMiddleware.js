"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
var jwt_1 = require("../utils/jwt");
var appError_1 = require("../utils/appError");
var authMiddleware = function (req, res, next) {
    var authorization = req.headers.authorization;
    if (!authorization)
        throw new appError_1.AppError(401, 'Authorization header is missing');
    var user = (0, jwt_1.verifyToken)(authorization);
    if (!user)
        throw new appError_1.AppError(401, 'Invalid token');
    req.headers.userData = { _id: user._id, username: user.username };
    next();
};
exports.authMiddleware = authMiddleware;
//# sourceMappingURL=authMiddleware.js.map