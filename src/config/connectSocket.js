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
        while (_) try {
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var websocket_1 = require("websocket");
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var models_1 = __importDefault(require("../models"));
var sendPush_1 = __importDefault(require("../utils/sendPush"));
var connectSocket = function (httpServer) {
    var connectionList = [];
    var wsServer = new websocket_1.server({ httpServer: httpServer });
    wsServer.on('request', function (req) {
        var onlineUserSet = new Set();
        var connection = req.accept(undefined, req.origin);
        var index = connectionList.push(connection) - 1;
        var userId;
        connection.on('message', function (msg) { return __awaiter(void 0, void 0, void 0, function () {
            var data_1, decoded_1, chat_1, members, recipient, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (msg.type !== 'utf8' || !msg.utf8Data) {
                            throw new Error('Empty message');
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 5, , 6]);
                        data_1 = JSON.parse(msg.utf8Data);
                        return [4 /*yield*/, jsonwebtoken_1.default.verify(data_1.token, process.env.SECRET_KEY)];
                    case 2:
                        decoded_1 = _a.sent();
                        return [4 /*yield*/, models_1.default.Chat.findById(data_1.chatID)];
                    case 3:
                        chat_1 = _a.sent();
                        members = JSON.stringify(chat_1 === null || chat_1 === void 0 ? void 0 : chat_1.members);
                        recipient = JSON.parse(members).find(function (id) { return id !== decoded_1.userId; });
                        userId = decoded_1.userId;
                        return [4 /*yield*/, models_1.default.Message.create({
                                text: data_1.text,
                                author: decoded_1.userId,
                                chatID: chat_1 === null || chat_1 === void 0 ? void 0 : chat_1.id,
                            })];
                    case 4:
                        _a.sent();
                        onlineUserSet.add(decoded_1.userId);
                        connectionList.forEach(function (user) { return user.sendUTF(JSON.stringify({
                            text: data_1.text,
                            author: decoded_1.login,
                            chatID: chat_1 === null || chat_1 === void 0 ? void 0 : chat_1.id,
                        })); });
                        if (!onlineUserSet.has(recipient)) {
                            sendPush_1.default(recipient, {
                                title: decoded_1.login + " sent you a message!",
                                body: data_1.text,
                            });
                        }
                        return [3 /*break*/, 6];
                    case 5:
                        err_1 = _a.sent();
                        console.error(err_1);
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        }); });
        connection.on('close', function () {
            connectionList.splice(index, 1);
            onlineUserSet.delete(userId);
        });
    });
};
exports.default = connectSocket;
