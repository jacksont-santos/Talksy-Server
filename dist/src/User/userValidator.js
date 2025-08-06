"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUserAuthDTO = void 0;
var zod_1 = require("zod");
var appError_1 = require("../utils/appError");
var authDTO = zod_1.z.object({
    username: zod_1.z.string().min(4, "too short").max(20, "too long"),
    password: zod_1.z.string().min(6, "too short").max(16, "too long"),
});
var validateUserAuthDTO = function (req, res, next) {
    var result = authDTO.safeParse(req.body);
    if (!result.success) {
        var message_1 = [];
        result.error.issues.forEach(function (issue) {
            message_1.push("".concat(issue.path[0], ": ").concat(issue.message));
        });
        throw new appError_1.AppError(400, message_1);
    }
    ;
    req.body = result.data;
    next();
};
exports.validateUserAuthDTO = validateUserAuthDTO;
//# sourceMappingURL=userValidator.js.map