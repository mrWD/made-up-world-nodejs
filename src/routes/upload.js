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
var multer_1 = __importDefault(require("multer"));
var path_1 = __importDefault(require("path"));
var mkdirp_1 = __importDefault(require("mkdirp"));
var models_1 = __importDefault(require("../models"));
var _a = process.env.DESTINATION, DESTINATION = _a === void 0 ? 'uploads' : _a;
var AVAILABLE_EXTENTIONS = ['.png', '.jpg', '.jpeg'];
var router = express_1.default.Router();
var storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) { return __awaiter(void 0, void 0, void 0, function () {
        var today, dir, fullDir;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    today = new Date();
                    dir = "/" + today.getFullYear() + "/" + today.getMonth() + "/" + today.getDate();
                    fullDir = "" + DESTINATION + dir;
                    req.body.dir = dir;
                    return [4 /*yield*/, mkdirp_1.default(fullDir)];
                case 1:
                    _a.sent();
                    cb(null, fullDir);
                    return [2 /*return*/];
            }
        });
    }); },
    filename: function (req, file, cb) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, userId, dir, name, ext, fileName;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = req.body, userId = _a.userId, dir = _a.dir;
                    name = Date.now().toString(36);
                    ext = path_1.default.extname(file.originalname);
                    fileName = "" + name + ext;
                    return [4 /*yield*/, models_1.default.User.findByIdAndUpdate(userId, {
                            photo: dir + "/" + fileName,
                        })];
                case 1:
                    _b.sent();
                    cb(null, fileName);
                    return [2 /*return*/];
            }
        });
    }); },
});
var upload = multer_1.default({
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 },
    fileFilter: function (req, file, cb) {
        var ext = path_1.default.extname(file.originalname);
        if (AVAILABLE_EXTENTIONS.includes(ext)) {
            cb(null, true);
            return;
        }
        var err = new Error("You can upload files with " + AVAILABLE_EXTENTIONS.join(', ') + " extention!");
        cb(err);
    }
}).single('file');
router.post('/image', function (req, res) {
    upload(req, res, function (err) {
        if (err && err.code === 'LIMIT_FILE_SIZE') {
            return res.status(401).json({
                error: 'Max photo size is 2mb!',
            });
        }
        if (err && err.code === 'EXTENTION') {
            return res.status(401).json({
                error: err.message,
            });
        }
        res.status(200).json('success');
    });
});
exports.default = router;
