"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var authMiddleware_1 = require("../middlewares/authMiddleware");
var roomService_1 = require("./roomService");
var roomValidator_1 = require("./roomValidator");
var router = (0, express_1.Router)();
var roomService = new roomService_1.RoomService();
router.get("/", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, roomService.getPublicRooms()];
            case 1:
                response = _a.sent();
                res
                    .status(response.statusCode)
                    .json({ message: response.message, data: response.data });
                return [2 /*return*/];
        }
    });
}); });
router.get("/id/:id", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var roomId, response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                roomId = req.params.id;
                return [4 /*yield*/, roomService.getRoomById(roomId)];
            case 1:
                response = _a.sent();
                res
                    .status(response.statusCode)
                    .json({ message: response.message, data: response.data });
                return [2 /*return*/];
        }
    });
}); });
router.get("/private", authMiddleware_1.authMiddleware, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                userId = req.headers.userData._id;
                return [4 /*yield*/, roomService.getPrivateRooms(userId)];
            case 1:
                response = _a.sent();
                res
                    .status(response.statusCode)
                    .json({ message: response.message, data: response.data });
                return [2 /*return*/];
        }
    });
}); });
router.get("/private/:id", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var roomId, response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                roomId = req.params.id;
                return [4 /*yield*/, roomService.getPrivateRoomById(roomId)];
            case 1:
                response = _a.sent();
                res
                    .status(response.statusCode)
                    .json({ message: response.message, data: response.data });
                return [2 /*return*/];
        }
    });
}); });
router.post("/create", [authMiddleware_1.authMiddleware, roomValidator_1.validateRoomDTO], function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, name, maxUsers, isPublic, password, userId, response;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, name = _a.name, maxUsers = _a.maxUsers, isPublic = _a.isPublic, password = _a.password;
                userId = req.headers.userData._id;
                return [4 /*yield*/, roomService.createRoom(userId, {
                        name: name,
                        maxUsers: maxUsers,
                        isPublic: isPublic,
                        password: password,
                    })];
            case 1:
                response = _b.sent();
                res
                    .status(response.statusCode)
                    .json({ message: response.message, data: response.data });
                return [2 /*return*/];
        }
    });
}); });
router.put("/update/:id", [authMiddleware_1.authMiddleware, roomValidator_1.validateRoomDTO], function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var roomId, _a, name, maxUsers, isPublic, active, password, userId, response;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                roomId = req.params.id;
                _a = req.body, name = _a.name, maxUsers = _a.maxUsers, isPublic = _a.isPublic, active = _a.active, password = _a.password;
                userId = req.headers.userData._id;
                return [4 /*yield*/, roomService.editRoom(userId, roomId, {
                        name: name,
                        maxUsers: maxUsers,
                        isPublic: isPublic,
                        active: active,
                        password: password,
                    })];
            case 1:
                response = _b.sent();
                res
                    .status(response.statusCode)
                    .json({ message: response.message, data: response.data });
                return [2 /*return*/];
        }
    });
}); });
router.delete("/delete/:Id", authMiddleware_1.authMiddleware, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var roomId, userId, response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                roomId = req.params.Id;
                userId = req.headers.userData._id;
                return [4 /*yield*/, roomService.deleteRoom(userId, roomId)];
            case 1:
                response = _a.sent();
                res
                    .status(response.statusCode)
                    .json({ message: response.message });
                return [2 /*return*/];
        }
    });
}); });
router.get("/messages/:id", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var roomId, _a, page, limit, response;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                roomId = req.params.id;
                _a = req.query, page = _a.page, limit = _a.limit;
                return [4 /*yield*/, roomService.getRoomMessages(roomId, Number(page), Number(limit))];
            case 1:
                response = _b.sent();
                res
                    .status(response.statusCode)
                    .json({ message: response.message, data: response.data });
                return [2 /*return*/];
        }
    });
}); });
exports.default = router;
//# sourceMappingURL=roomController.js.map