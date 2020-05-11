"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var User_1 = __importDefault(require("./User"));
var Page_1 = __importDefault(require("./Page"));
var Push_1 = __importDefault(require("./Push"));
var Chat_1 = __importDefault(require("./Chat"));
var Message_1 = __importDefault(require("./Message"));
var models = {
    User: User_1.default,
    Page: Page_1.default,
    Push: Push_1.default,
    Chat: Chat_1.default,
    Message: Message_1.default,
};
exports.default = models;
