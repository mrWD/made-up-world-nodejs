"use strict";
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
var bcrypt_nodejs_1 = __importDefault(require("bcrypt-nodejs"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var connectWebPush_1 = require("../config/connectWebPush");
var validator_1 = __importDefault(require("../utils/validator"));
var models_1 = __importDefault(require("../models"));
var _a = process.env.SECRET_KEY, SECRET_KEY = _a === void 0 ? 'jwtsecret' : _a;
var router = express_1.default.Router();
router.post('/signup', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, login, password, passwordConfirm, logAndPassValidation, passwordConfirmValidation, user, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, login = _a.login, password = _a.password, passwordConfirm = _a.passwordConfirm;
                logAndPassValidation = validator_1.default.validateLoginPassword(login, password);
                passwordConfirmValidation = validator_1.default.validatePassConfirm(password, passwordConfirm);
                if (logAndPassValidation || passwordConfirmValidation) {
                    return [2 /*return*/, res.json({
                            error: logAndPassValidation || passwordConfirmValidation,
                        })];
                }
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, models_1.default.User.findOne({ login: login })];
            case 2:
                user = _b.sent();
                if (user) {
                    return [2 /*return*/, res.status(400).json({
                            error: 'Login is already used!',
                        })];
                }
                bcrypt_nodejs_1.default.hash(password, '', null, function (_, hash) { return __awaiter(void 0, void 0, void 0, function () {
                    var newUser, err_2;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                _a.trys.push([0, 2, , 3]);
                                return [4 /*yield*/, models_1.default.User.create({
                                        login: login,
                                        password: hash,
                                    })];
                            case 1:
                                newUser = _a.sent();
                                res.status(200).json(newUser.id);
                                return [3 /*break*/, 3];
                            case 2:
                                err_2 = _a.sent();
                                console.error(err_2);
                                res.status(500).json({
                                    error: 'Sorry! Something went wrong!',
                                });
                                return [3 /*break*/, 3];
                            case 3: return [2 /*return*/];
                        }
                    });
                }); });
                return [3 /*break*/, 4];
            case 3:
                err_1 = _b.sent();
                console.error(err_1);
                res.status(500).json({
                    error: 'Sorry! Something went wrong!',
                });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.post('/signin', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, login, password, user_1, err_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, login = _a.login, password = _a.password;
                if (!login || !password) {
                    return [2 /*return*/, res.status(400).json({
                            error: 'All fields are required!',
                        })];
                }
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, models_1.default.User.findOne({ login: login })];
            case 2:
                user_1 = _b.sent();
                if (!user_1) {
                    return [2 /*return*/, res.status(400).json({
                            error: 'Login or password is wrong!',
                        })];
                }
                bcrypt_nodejs_1.default.compare(password, user_1.password, function (err, result) {
                    if (!result) {
                        return res.status(400).json({
                            error: 'Login or password is wrong!',
                        });
                    }
                    var token = jsonwebtoken_1.default.sign({
                        userId: user_1._id,
                        login: user_1.login,
                        vapidKey: connectWebPush_1.VAPIDKeyPublic,
                    }, SECRET_KEY);
                    if (!token) {
                        return res.status(400).json({
                            error: 'Token is not created!',
                        });
                    }
                    res.status(200).json({ token: token });
                });
                return [3 /*break*/, 4];
            case 3:
                err_3 = _b.sent();
                console.error(err_3);
                res.status(500).json({
                    error: 'Sorry! Something went wrong!',
                });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.get('/', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var decoded, user, err_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, jsonwebtoken_1.default.verify(req.headers.authorization, SECRET_KEY)];
            case 1:
                decoded = _a.sent();
                return [4 /*yield*/, models_1.default.User.findById(decoded.userId)
                        .populate('friends', { login: 1 })];
            case 2:
                user = _a.sent();
                if (!user) {
                    return [2 /*return*/, res.status(400).json({
                            error: 'There is not such user!',
                        })];
                }
                res.status(200).json({
                    login: user.login,
                });
                return [3 /*break*/, 4];
            case 3:
                err_4 = _a.sent();
                console.error(err_4);
                return [2 /*return*/, res.status(401).json({
                        error: 'Unauthorised',
                    })];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.get('/logout', function (req, res) {
    if (req.session) {
        req.session.destroy(function () {
            res.redirect('/');
        });
        return;
    }
    res.redirect('/');
});
exports.default = router;
