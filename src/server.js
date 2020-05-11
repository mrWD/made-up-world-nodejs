"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var body_parser_1 = __importDefault(require("body-parser"));
var cors_1 = __importDefault(require("cors"));
var express_session_1 = __importDefault(require("express-session"));
var dotenv_1 = __importDefault(require("dotenv"));
var config_1 = __importDefault(require("./config"));
var routes_1 = __importDefault(require("./routes"));
dotenv_1.default.config();
var app = express_1.default();
app.use(express_session_1.default({
    secret: process.env.SESSION_SECRET || '',
    resave: true,
    saveUninitialized: false,
    store: config_1.default.connectDB(express_session_1.default),
}));
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(body_parser_1.default.json());
app.use(cors_1.default());
app.get("/api/" + process.env.DESTINATION + "/:year/:month/:day/:name", function (req, res) {
    var _a = req.params, year = _a.year, month = _a.month, day = _a.day, name = _a.name;
    var imgRoute = year + "/" + month + "/" + day + "/" + name;
    res.set({ 'Content-Type': 'image/png' })
        .sendFile(__dirname + "/" + process.env.DESTINATION + "/" + imgRoute);
});
app.use('/api/auth', routes_1.default.auth);
app.use('/api/users', routes_1.default.users);
app.use('/api/editing', routes_1.default.editing);
app.use('/api/reading', routes_1.default.reading);
app.use('/api/push', routes_1.default.pushNotification);
app.use('/api/upload', routes_1.default.upload);
app.use('/api/chats', routes_1.default.chats);
if (process.env.NODE_ENV === 'pruduction') {
    app.get('/', function (req, res) { return res.send('API is running!'); });
    // app.get('/', (req, res) => res.sendFile(`${__dirname}/views/index.html`));
    // app.use(express.static(`${__dirname}/public/`));
    // app.get('/uploads', (req, res) => res.sendFile(path.join(__dirname, process.env.DESTINATION || '')));
}
config_1.default.connectSocket(app.listen(process.env.PORT, function () { return console.log("Server started on port " + process.env.PORT); }));
