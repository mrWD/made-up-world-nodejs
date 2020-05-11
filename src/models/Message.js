"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var schema = new mongoose_1.default.Schema({
    text: {
        type: String,
    },
    author: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
    },
    chatID: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Chat',
    },
}, {
    timestamps: true,
});
schema.set('toJSON', {
    virtuals: true,
});
exports.default = mongoose_1.default.model('Message', schema);
