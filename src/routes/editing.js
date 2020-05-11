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
var transliter_1 = __importDefault(require("../utils/transliter"));
var sendPush_1 = __importDefault(require("../utils/sendPush"));
var _a = process.env.SECRET_KEY, SECRET_KEY = _a === void 0 ? 'jwtsecret' : _a;
var router = express_1.default.Router();
router.post('/all', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var storyURL, authorization, decoded, pageList, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                storyURL = req.body.storyURL, authorization = req.headers.authorization;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, jsonwebtoken_1.default.verify(authorization, SECRET_KEY)];
            case 2:
                decoded = _a.sent();
                return [4 /*yield*/, models_1.default.Page.find({
                        storyURL: storyURL,
                        owner: decoded.userId,
                    })];
            case 3:
                pageList = _a.sent();
                if (!pageList || !pageList[0]) {
                    return [2 /*return*/, res.status(400).json({
                            error: 'There are not such pages!',
                        })];
                }
                res.status(200).json(pageList);
                return [3 /*break*/, 5];
            case 4:
                err_1 = _a.sent();
                console.error(err_1);
                res.status(500).json({
                    error: 'Sorry! Something went wrong!',
                });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
router.post('/save-story', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var isFirstChanged, decoded, pageList, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                isFirstChanged = req.body.changes.some(function (_a) {
                    var isFirst = _a.isFirst;
                    return isFirst;
                });
                return [4 /*yield*/, jsonwebtoken_1.default.verify(req.headers.authorization, SECRET_KEY)];
            case 1:
                decoded = _a.sent();
                req.body.changes.forEach(function (item) { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, models_1.default.Page.findByIdAndUpdate(item.id, __assign(__assign({}, (item.isFirst && { isFirst: item.isFirst })), { nextPages: item.nextPages }))];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                if (!isFirstChanged) return [3 /*break*/, 3];
                return [4 /*yield*/, models_1.default.Page.findOneAndUpdate({ isFirst: true }, { isFirst: false })];
            case 2:
                _a.sent();
                _a.label = 3;
            case 3: return [4 /*yield*/, models_1.default.Page.find({
                    storyURL: req.body.storyURL,
                    owner: decoded.userId,
                })];
            case 4:
                pageList = _a.sent();
                res.status(200).json(pageList);
                return [3 /*break*/, 6];
            case 5:
                err_2 = _a.sent();
                console.error(err_2);
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
router.post('/save', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, pageId, title, body, storyURL, options, nextPages, _b, isFirst, authorization, newStoryURL, editParams, decoded, user, editedPage, err_3;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = req.body, pageId = _a.pageId, title = _a.title, body = _a.body, storyURL = _a.storyURL, options = _a.options, nextPages = _a.nextPages, _b = _a.isFirst, isFirst = _b === void 0 ? false : _b, authorization = req.headers.authorization;
                newStoryURL = transliter_1.default.getSlugString(title) + "-" + Date.now().toString(36);
                editParams = __assign(__assign(__assign(__assign(__assign({}, (title && { title: title })), (body && { body: body })), (options && { options: options })), (nextPages && { nextPages: nextPages })), { storyURL: storyURL || newStoryURL, isFirst: !storyURL || isFirst });
                _c.label = 1;
            case 1:
                _c.trys.push([1, 8, , 9]);
                return [4 /*yield*/, jsonwebtoken_1.default.verify(authorization, SECRET_KEY)];
            case 2:
                decoded = _c.sent();
                user = models_1.default.User.findById(decoded.userId);
                editedPage = null;
                if (!user) {
                    return [2 /*return*/, res.status(400).json({
                            error: 'There is not the user!',
                        })];
                }
                if (!(isFirst && storyURL)) return [3 /*break*/, 4];
                return [4 /*yield*/, models_1.default.Page.findOneAndUpdate({ storyURL: storyURL, isFirst: isFirst }, { isFirst: false })];
            case 3:
                _c.sent();
                _c.label = 4;
            case 4:
                if (!!pageId) return [3 /*break*/, 6];
                return [4 /*yield*/, models_1.default.Page.create(__assign(__assign({}, editParams), { owner: decoded.userId }))];
            case 5:
                editedPage = _c.sent();
                if (!editedPage) {
                    return [2 /*return*/, res.status(400).json({
                            error: 'There is not the page!',
                        })];
                }
                return [2 /*return*/, res.status(200).json({
                        pageId: editedPage.id,
                        storyURL: editedPage.storyURL,
                    })];
            case 6: return [4 /*yield*/, models_1.default.Page.findOneAndUpdate({
                    _id: pageId,
                    owner: decoded.userId,
                }, editParams)];
            case 7:
                editedPage = _c.sent();
                if (!editedPage) {
                    return [2 /*return*/, res.status(400).json({
                            error: 'There is not the page!',
                        })];
                }
                res.status(200).json({
                    pageId: editedPage.id,
                    storyURL: editedPage.storyURL,
                });
                return [3 /*break*/, 9];
            case 8:
                err_3 = _c.sent();
                console.error(err_3);
                res.status(500).json({
                    error: 'Sorry! Something went wrong!',
                });
                return [3 /*break*/, 9];
            case 9: return [2 /*return*/];
        }
    });
}); });
router.post('/edit', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var pageId, authorization, decoded, page, err_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                pageId = req.body.pageId, authorization = req.headers.authorization;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, jsonwebtoken_1.default.verify(authorization, SECRET_KEY)];
            case 2:
                decoded = _a.sent();
                return [4 /*yield*/, models_1.default.Page.findOne({
                        _id: pageId,
                        owner: decoded.userId,
                    })];
            case 3:
                page = _a.sent();
                if (!page) {
                    return [2 /*return*/, res.status(400).json({
                            error: 'There is not the page!',
                        })];
                }
                res.status(200).json(page);
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
router.post('/remove-page', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var pageId, authorization, decoded, err_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                pageId = req.body.pageId, authorization = req.headers.authorization;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, jsonwebtoken_1.default.verify(authorization, SECRET_KEY)];
            case 2:
                decoded = _a.sent();
                return [4 /*yield*/, models_1.default.Page.deleteOne({
                        _id: pageId,
                        owner: decoded.userId,
                    })];
            case 3:
                _a.sent();
                res.status(200).json('success');
                return [3 /*break*/, 5];
            case 4:
                err_5 = _a.sent();
                console.error(err_5);
                res.status(500).json({
                    error: 'Sorry! Something went wrong!',
                });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
router.post('/remove-story', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var storyURL, authorization, decoded, err_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                storyURL = req.body.storyURL, authorization = req.headers.authorization;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, jsonwebtoken_1.default.verify(authorization, SECRET_KEY)];
            case 2:
                decoded = _a.sent();
                return [4 /*yield*/, models_1.default.Page.deleteMany({ storyURL: storyURL, owner: decoded.userId })];
            case 3:
                _a.sent();
                res.status(200).json('success');
                return [3 /*break*/, 5];
            case 4:
                err_6 = _a.sent();
                console.error(err_6);
                res.status(500).json({
                    error: 'Sorry! Something went wrong!',
                });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
router.post('/publish', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var storyURL, authorization, decoded, owner, pages, ellipsis, title, err_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                storyURL = req.body.storyURL, authorization = req.headers.authorization;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 6, , 7]);
                return [4 /*yield*/, jsonwebtoken_1.default.verify(authorization, SECRET_KEY)];
            case 2:
                decoded = _a.sent();
                return [4 /*yield*/, models_1.default.User.findById(decoded.userId)];
            case 3:
                owner = _a.sent();
                return [4 /*yield*/, models_1.default.Page.find({ storyURL: storyURL, owner: decoded.userId })];
            case 4:
                pages = _a.sent();
                ellipsis = pages[0].title.length > 100 ? '...' : '';
                title = pages[0].title.substring(0, ellipsis ? 97 : 100);
                return [4 /*yield*/, models_1.default.Page.updateMany({ storyURL: storyURL, owner: decoded.userId }, { isPublished: true })];
            case 5:
                _a.sent();
                if (!owner) {
                    return [2 /*return*/, res.status(400).json({
                            error: 'There is not the user!',
                        })];
                }
                if (!pages || !pages[0]) {
                    return [2 /*return*/, res.status(400).json({
                            error: 'There is not the story!',
                        })];
                }
                res.status(200).json('success');
                sendPush_1.default(owner.followers, {
                    title: owner.login + " published a new story!",
                    body: "" + title + ellipsis,
                });
                return [3 /*break*/, 7];
            case 6:
                err_7 = _a.sent();
                console.error(err_7);
                res.status(500).json({
                    error: 'Sorry! Something went wrong!',
                });
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); });
router.post('/unpublish', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var storyURL, authorization, decoded, err_8;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                storyURL = req.body.storyURL, authorization = req.headers.authorization;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, jsonwebtoken_1.default.verify(authorization, SECRET_KEY)];
            case 2:
                decoded = _a.sent();
                return [4 /*yield*/, models_1.default.Page.updateMany({ storyURL: storyURL, owner: decoded.userId }, { isPublished: false })];
            case 3:
                _a.sent();
                res.status(200).json('success');
                return [3 /*break*/, 5];
            case 4:
                err_8 = _a.sent();
                console.error(err_8);
                res.status(500).json({
                    error: 'Sorry! Something went wrong!',
                });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
exports.default = router;
