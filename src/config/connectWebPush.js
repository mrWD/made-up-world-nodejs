"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var web_push_1 = __importDefault(require("web-push"));
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
var _a = web_push_1.default.generateVAPIDKeys(), publicKey = _a.publicKey, privateKey = _a.privateKey;
exports.VAPIDKeyPublic = publicKey;
web_push_1.default.setVapidDetails(process.env.URL || '', publicKey, privateKey);
exports.default = web_push_1.default;
