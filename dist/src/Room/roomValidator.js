"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRoomDTO = void 0;
var zod_1 = require("zod");
var appError_1 = require("../utils/appError");
var createRoomDTO = zod_1.z.object({
    name: zod_1.z.string().min(4, "too short").max(20, "too long"),
    password: zod_1.z.string().min(6, "too short").max(16, "too long").optional(),
    maxUsers: zod_1.z
        .number()
        .int("Is not Int number")
        .min(2, "Invalid users number")
        .max(10, "Invalid users number"),
    isPublic: zod_1.z.boolean().optional(),
});
var updateRoomDTO = zod_1.z.object({
    name: zod_1.z.string().min(4, "too short").max(20, "too long").optional(),
    password: zod_1.z.string().min(6, "too short").max(16, "too long").optional(),
    maxUsers: zod_1.z
        .number()
        .int("Is not Int number")
        .min(2, "Invalid users number")
        .max(10, "Invalid users number")
        .optional(),
    active: zod_1.z.boolean().optional(),
    public: zod_1.z.boolean().optional(),
});
var validateRoomDTO = function (req, res, next) {
    var DTO = req.method == 'POST' ? createRoomDTO :
        req.method == 'PUT' ? updateRoomDTO :
            null;
    if (!DTO)
        return next();
    var result = DTO.safeParse(req.body);
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
exports.validateRoomDTO = validateRoomDTO;
//# sourceMappingURL=roomValidator.js.map