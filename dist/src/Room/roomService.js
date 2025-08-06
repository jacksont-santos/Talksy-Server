"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.RoomService = void 0;
var models_1 = require("../database/models");
var crypto_1 = require("../utils/crypto");
var wsService_1 = require("../ws/wsService");
var wsService = new wsService_1.WSService();
var RoomService = /** @class */ (function () {
    function RoomService() {
    }
    RoomService.prototype.getPublicRooms = function () {
        return __awaiter(this, void 0, void 0, function () {
            var rooms;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, models_1.roomModel.find({ public: true }, { password: 0 })];
                    case 1:
                        rooms = _a.sent();
                        return [2 /*return*/, { statusCode: 200, data: rooms.length ? rooms : [] }];
                }
            });
        });
    };
    RoomService.prototype.getRoomById = function (roomId) {
        return __awaiter(this, void 0, void 0, function () {
            var room;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, models_1.roomModel.findOne({ _id: roomId }, { password: 0 })];
                    case 1:
                        room = _a.sent();
                        if (!room)
                            return [2 /*return*/, { statusCode: 404 }];
                        return [2 /*return*/, { statusCode: 200, data: room }];
                }
            });
        });
    };
    RoomService.prototype.getPrivateRooms = function (ownerId) {
        return __awaiter(this, void 0, void 0, function () {
            var privateRooms;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, models_1.roomModel.find({ ownerId: ownerId, public: false }, { password: 0 })];
                    case 1:
                        privateRooms = _a.sent();
                        return [2 /*return*/, { statusCode: 200, data: privateRooms.length ? privateRooms : [] }];
                }
            });
        });
    };
    RoomService.prototype.getPrivateRoomById = function (roomId) {
        return __awaiter(this, void 0, void 0, function () {
            var privateRoom;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, models_1.roomModel.findOne({ _id: roomId }, { password: 0 })];
                    case 1:
                        privateRoom = _a.sent();
                        if (!privateRoom)
                            return [2 /*return*/, { statusCode: 404 }];
                        return [2 /*return*/, { statusCode: 200, data: privateRoom }];
                }
            });
        });
    };
    RoomService.prototype.createRoom = function (ownerId_1, _a) {
        return __awaiter(this, arguments, void 0, function (ownerId, _b) {
            var newRoomData, _c, room, message, success;
            var _d;
            var name = _b.name, maxUsers = _b.maxUsers, isPublic = _b.isPublic, password = _b.password;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        if (!isPublic && !password)
                            return [2 /*return*/, { statusCode: 400, message: "Password is required for private rooms" }];
                        _d = {
                            ownerId: ownerId,
                            name: name,
                            maxUsers: maxUsers,
                            active: true,
                            public: !!isPublic
                        };
                        if (!password) return [3 /*break*/, 2];
                        return [4 /*yield*/, (0, crypto_1.hashPassword)(password)];
                    case 1:
                        _c = _e.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        _c = undefined;
                        _e.label = 3;
                    case 3:
                        newRoomData = (_d.password = _c,
                            _d);
                        return [4 /*yield*/, models_1.roomModel.create(newRoomData)];
                    case 4:
                        room = (_e.sent()).toObject();
                        if (!room)
                            return [2 /*return*/, { statusCode: 500, message: "Internal server error" }];
                        if (room.password)
                            delete room.password;
                        message = {
                            notification: true,
                            type: 'addRoom',
                            userId: ownerId,
                            data: __assign(__assign({}, room), { roomId: room._id })
                        };
                        return [4 /*yield*/, wsService.sendMessage(message)];
                    case 5:
                        success = (_e.sent()).success;
                        return [2 /*return*/, {
                                statusCode: 201,
                                message: success ? 'Room created successfully' : 'Communication failed',
                                data: room
                            }];
                }
            });
        });
    };
    RoomService.prototype.editRoom = function (userId_1, roomId_1, _a) {
        return __awaiter(this, arguments, void 0, function (userId, roomId, _b) {
            var room, _c, _d, _e, updatedRoom, message, success;
            var name = _b.name, maxUsers = _b.maxUsers, isPublic = _b.isPublic, active = _b.active, password = _b.password;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0: return [4 /*yield*/, models_1.roomModel.findOne({ _id: roomId, ownerId: userId })];
                    case 1:
                        room = _f.sent();
                        if (!room)
                            return [2 /*return*/, { statusCode: 404, message: "Room not found" }];
                        if (room.ownerId != userId)
                            return [2 /*return*/, { statusCode: 401, message: "Unauthorized" }];
                        if (!name && !maxUsers && !isPublic && !password)
                            return [2 /*return*/, { statusCode: 400, message: "Missing required fields" }];
                        if (!isPublic && !password && !room.password)
                            return [2 /*return*/, { statusCode: 400, message: "Password is required for private rooms" }];
                        room.name = name || room.name;
                        room.maxUsers = maxUsers || room.maxUsers;
                        room.public = isPublic || room.public;
                        room.active = active || room.active;
                        _c = room;
                        if (!isPublic) return [3 /*break*/, 2];
                        _d = undefined;
                        return [3 /*break*/, 6];
                    case 2:
                        if (!password) return [3 /*break*/, 4];
                        return [4 /*yield*/, (0, crypto_1.hashPassword)(password)];
                    case 3:
                        _e = _f.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        _e = room.password;
                        _f.label = 5;
                    case 5:
                        _d = _e;
                        _f.label = 6;
                    case 6:
                        _c.password = _d;
                        return [4 /*yield*/, room.save()];
                    case 7:
                        updatedRoom = (_f.sent()).toObject();
                        if (updatedRoom.password)
                            delete updatedRoom.password;
                        message = {
                            notification: true,
                            type: 'updateRoom',
                            userId: userId,
                            data: __assign(__assign({}, updatedRoom), { roomId: room._id })
                        };
                        return [4 /*yield*/, wsService.sendMessage(message)];
                    case 8:
                        success = (_f.sent()).success;
                        return [2 /*return*/, {
                                statusCode: 200,
                                message: success ? 'Room updated successfully' : 'Communication failed',
                                data: updatedRoom
                            }];
                }
            });
        });
    };
    RoomService.prototype.deleteRoom = function (userId, roomId) {
        return __awaiter(this, void 0, void 0, function () {
            var response, message, success;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, models_1.roomModel.findOneAndDelete({ _id: roomId, ownerId: userId }, { projection: { public: 1 } })];
                    case 1:
                        response = _a.sent();
                        if (!response)
                            return [2 /*return*/, { statusCode: 404, message: "Room not found" }];
                        message = {
                            notification: true,
                            type: 'removeRoom',
                            userId: userId,
                            data: { roomId: roomId, public: response.public },
                        };
                        return [4 /*yield*/, wsService.sendMessage(message)];
                    case 2:
                        success = (_a.sent()).success;
                        return [2 /*return*/, {
                                statusCode: 200,
                                message: success ? 'Room deleted successfully' : 'Communication failed',
                                data: { _id: roomId }
                            }];
                }
            });
        });
    };
    RoomService.prototype.getRoomMessages = function (roomId_1) {
        return __awaiter(this, arguments, void 0, function (roomId, page, limit) {
            var room, skip, messages, data;
            if (page === void 0) { page = 1; }
            if (limit === void 0) { limit = 10; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, models_1.roomModel.exists({ _id: roomId })];
                    case 1:
                        room = _a.sent();
                        if (!room)
                            return [2 /*return*/, { statusCode: 404, message: "Room not found" }];
                        skip = (page - 1) * limit;
                        return [4 /*yield*/, models_1.chatModel.aggregate([
                                { $match: { roomId: roomId } },
                                { $project: {
                                        _id: 0,
                                        chat: { $slice: ['$chat', skip, limit] }
                                    } }
                            ])];
                    case 2:
                        messages = _a.sent();
                        data = messages.length ? messages[0].chat.reverse() : [];
                        return [2 /*return*/, { statusCode: 200, data: data }];
                }
            });
        });
    };
    return RoomService;
}());
exports.RoomService = RoomService;
//# sourceMappingURL=roomService.js.map