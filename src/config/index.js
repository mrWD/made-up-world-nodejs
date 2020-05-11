"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var connectDB_1 = __importDefault(require("./connectDB"));
var connectSocket_1 = __importDefault(require("./connectSocket"));
exports.default = {
    connectDB: connectDB_1.default,
    connectSocket: connectSocket_1.default,
};
