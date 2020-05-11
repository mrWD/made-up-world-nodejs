"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var schema = new mongoose_1.Schema({
    members: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'User',
        }],
});
schema.set('toJSON', {
    virtuals: true,
});
exports.default = mongoose_1.model('Chat', schema);
