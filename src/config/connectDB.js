"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var connect_mongo_1 = __importDefault(require("connect-mongo"));
var mongoose_1 = __importDefault(require("mongoose"));
var mocks_1 = __importDefault(require("../mocks"));
var connectDB = function (session) {
    var MongoStore = connect_mongo_1.default(session);
    mongoose_1.default.Promise = global.Promise;
    mongoose_1.default.set('debug', process.env.NODE_ENV === 'production');
    mongoose_1.default.connection
        .on('error', function (error) { return console.log(error); })
        .on('close', function () { return console.log('Database connection closed.'); })
        .once('open', function () {
        var info = mongoose_1.default.connections[0];
        console.log("Connected to " + info.host + ":" + info.port + "/" + info.name);
        mocks_1.default.stories();
        mocks_1.default.sendPush();
    });
    mongoose_1.default.connect(process.env.MONGO_URL || '', {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
    });
    return new MongoStore({
        mongooseConnection: mongoose_1.default.connection,
    });
};
exports.default = connectDB;
