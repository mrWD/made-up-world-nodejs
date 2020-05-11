"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var auth_1 = __importDefault(require("./auth"));
var users_1 = __importDefault(require("./users"));
var editing_1 = __importDefault(require("./editing"));
var reading_1 = __importDefault(require("./reading"));
var pushNotification_1 = __importDefault(require("./pushNotification"));
var upload_1 = __importDefault(require("./upload"));
var chats_1 = __importDefault(require("./chats"));
var routes = {
    auth: auth_1.default,
    users: users_1.default,
    editing: editing_1.default,
    reading: reading_1.default,
    pushNotification: pushNotification_1.default,
    upload: upload_1.default,
    chats: chats_1.default,
};
exports.default = routes;
