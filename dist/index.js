"use strict";

var _express = _interopRequireDefault(require("express"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _cors = _interopRequireDefault(require("cors"));

var _expressSession = _interopRequireDefault(require("express-session"));

var _dotenv = _interopRequireDefault(require("dotenv"));

var _config = _interopRequireDefault(require("./src/config"));

var _routes = _interopRequireDefault(require("./src/routes"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dotenv.default.config();

const app = (0, _express.default)();
app.use((0, _expressSession.default)({
  secret: process.env.SESSION_SECRET || '',
  resave: true,
  saveUninitialized: false,
  store: _config.default.connectDB(_expressSession.default)
}));
app.use(_bodyParser.default.urlencoded({
  extended: true
}));
app.use(_bodyParser.default.json());
app.use((0, _cors.default)());
app.get(`/api/${process.env.DESTINATION}/:year/:month/:day/:name`, (req, res) => {
  const {
    year,
    month,
    day,
    name
  } = req.params;
  const imgRoute = `${year}/${month}/${day}/${name}`;
  res.set({
    'Content-Type': 'image/png'
  }).sendFile(`${__dirname}/${process.env.DESTINATION}/${imgRoute}`);
});
app.use('/api/auth', _routes.default.auth);
app.use('/api/users', _routes.default.users);
app.use('/api/editing', _routes.default.editing);
app.use('/api/reading', _routes.default.reading);
app.use('/api/push', _routes.default.pushNotification);
app.use('/api/upload', _routes.default.upload);
app.use('/api/chats', _routes.default.chats); // if (process.env.NODE_ENV === 'pruduction') {
//   app.use(express.static(`${__dirname}/public/`));
//   app.get('/uploads', (req, res) => res.sendFile(path.join(__dirname, process.env.DESTINATION || '')));
// }

_config.default.connectSocket(app.listen(process.env.PORT, () => console.log(`Server started on port ${process.env.PORT}`)));
