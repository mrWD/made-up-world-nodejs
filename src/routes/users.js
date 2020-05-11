"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var express_1 = __importDefault(require("express"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var models_1 = __importDefault(require("../models"));
var sendPush_1 = __importDefault(require("../utils/sendPush"));
var _a = process.env.SECRET_KEY, SECRET_KEY = _a === void 0 ? 'jwtsecret' : _a;
var PER_PAGE = 10;
var router = express_1.default.Router();
router.post('/user-info', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, models_1.default.User.findOne({ login: req.body.login })
                        .populate('followers', { login: 1 })
                        .populate('followings', { login: 1 })];
            case 1:
                user = _a.sent();
                if (!user) {
                    return [2 /*return*/, res.status(400).json({
                            error: 'There is not the user!',
                        })];
                }
                res.status(200).json(__assign(__assign({}, user), { destination: process.env.DESTINATION }));
                return [3 /*break*/, 3];
            case 2:
                err_1 = _a.sent();
                console.error(err_1);
                res.status(500).json({
                    error: 'Sorry! Something went wrong!',
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post('/all', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b, page, _c, perPage, login, _d, sortBy, firstIndex, userList, err_2;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                _a = req.body, _b = _a.page, page = _b === void 0 ? 1 : _b, _c = _a.perPage, perPage = _c === void 0 ? PER_PAGE : _c, login = _a.login, _d = _a.sortBy, sortBy = _d === void 0 ? 'login' : _d;
                firstIndex = perPage * page - perPage;
                _e.label = 1;
            case 1:
                _e.trys.push([1, 3, , 4]);
                return [4 /*yield*/, models_1.default.User.find(__assign({}, (login && { login: new RegExp(login) })))
                        .sort(sortBy)
                        .populate('followers', { login: 1 })];
            case 2:
                userList = _e.sent();
                if (!userList || !userList[0]) {
                    return [2 /*return*/, res.status(400).json({
                            error: 'There are not such users!',
                        })];
                }
                res.status(200).json({
                    userList: userList.slice(firstIndex, firstIndex + perPage),
                    destination: process.env.DESTINATION,
                    pages: Math.ceil(userList.length / perPage),
                    page: page,
                });
                return [3 /*break*/, 4];
            case 3:
                err_2 = _e.sent();
                console.error(err_2);
                res.status(500).json({
                    error: 'Sorry! Something went wrong!',
                });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.post('/follow', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var decoded, followedUser, user, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                return [4 /*yield*/, jsonwebtoken_1.default.verify(req.headers.authorization, SECRET_KEY)];
            case 1:
                decoded = _a.sent();
                return [4 /*yield*/, models_1.default.User.findOneAndUpdate({ login: req.body.login }, { $push: { followers: decoded.userId } })];
            case 2:
                followedUser = _a.sent();
                return [4 /*yield*/, models_1.default.User.findByIdAndUpdate(decoded.userId, { $push: { followings: followedUser === null || followedUser === void 0 ? void 0 : followedUser.id } })];
            case 3:
                user = _a.sent();
                if (!followedUser || !user) {
                    return [2 /*return*/, res.status(400).json({
                            error: 'There is not the user!',
                        })];
                }
                sendPush_1.default(followedUser.id, {
                    title: user.login + " started following you!",
                });
                res.status(200).json('success');
                return [3 /*break*/, 5];
            case 4:
                err_3 = _a.sent();
                console.error(err_3);
                res.status(500).json({
                    error: 'Sorry! Something went wrong!',
                });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
router.post('/unfollow', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var decoded, user, followedUser, err_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                return [4 /*yield*/, jsonwebtoken_1.default.verify(req.headers.authorization, SECRET_KEY)];
            case 1:
                decoded = _a.sent();
                return [4 /*yield*/, models_1.default.User.findOneAndUpdate({ login: req.body.login }, {
                        $pull: {
                            followers: { $in: decoded.userId },
                        },
                    })];
            case 2:
                user = _a.sent();
                if (!user) {
                    return [2 /*return*/, res.status(400).json({
                            error: 'There is not the user!',
                        })];
                }
                return [4 /*yield*/, models_1.default.User.findByIdAndUpdate(decoded.userId, {
                        $pull: {
                            following: { $in: user.id },
                        },
                    })];
            case 3:
                followedUser = _a.sent();
                if (!followedUser) {
                    return [2 /*return*/, res.status(400).json({
                            error: 'There is not the user!',
                        })];
                }
                res.status(200).json('success');
                return [3 /*break*/, 5];
            case 4:
                err_4 = _a.sent();
                console.error(err_4);
                res.status(500).json({
                    error: 'Sorry! Something went wrong!',
                });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
exports.default = router;
