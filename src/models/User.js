"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importStar(require("mongoose"));
var schema = new mongoose_1.Schema({
    login: {
        type: String,
        require: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    photo: {
        type: String,
    },
    followers: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'User',
        }],
    followings: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'User',
        }],
}, {
    timestamps: true,
});
schema.set('toJSON', {
    virtuals: true,
});
exports.default = mongoose_1.default.model('User', schema);
