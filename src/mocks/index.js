"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var stories_1 = __importDefault(require("./stories"));
var sendPush_1 = __importDefault(require("./sendPush"));
exports.default = {
    stories: stories_1.default,
    sendPush: sendPush_1.default,
};
