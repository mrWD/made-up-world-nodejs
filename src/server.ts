import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import session from 'express-session';
import dotenv from 'dotenv';

import config from './config';
import routes from './routes';

dotenv.config();

const app = express();
const whitelist = [
  'http://localhost:5000/',
  'http://192.168.0.48:5000/',
  'http://localhost:8080/',
  'http://192.168.0.48:8080/',
  'https://made-up-world-vuejs.herokuapp.com/',
  'https://made-up-world-nodejs.herokuapp.com/',
];
const corsOptions = {
  origin: (origin: any, callback: any) => {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};

app.use(
  session({
    secret: process.env.SESSION_SECRET || '',
    resave: true,
    saveUninitialized: false,
    store: config.connectDB(session),
  })
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors(corsOptions));

app.get(`/api/${process.env.DESTINATION}/:year/:month/:day/:name`, cors(corsOptions), (req, res) => {
  const {
    year,
    month,
    day,
    name
  } = req.params;
  const imgRoute = `${year}/${month}/${day}/${name}`;

  res.set({ 'Content-Type': 'image/png' })
    .sendFile(`${__dirname}/${process.env.DESTINATION}/${imgRoute}`)
});

app.use('/api/auth', cors(corsOptions), routes.auth);
app.use('/api/users', cors(corsOptions), routes.users);
app.use('/api/editing', cors(corsOptions), routes.editing);
app.use('/api/reading', cors(corsOptions), routes.reading);
app.use('/api/push', cors(corsOptions), routes.pushNotification);
app.use('/api/upload', cors(corsOptions), routes.upload);
app.use('/api/chats', cors(corsOptions), routes.chats);

if (process.env.NODE_ENV === 'pruduction') {
  // app.get('/', (req, res) => res.send('API is running!'));
  app.get('/', cors(corsOptions), (req, res) => res.sendFile(`${__dirname}/views/index.html`));
  // app.use(express.static(`${__dirname}/public/`));

  // app.get('/uploads', (req, res) => res.sendFile(path.join(__dirname, process.env.DESTINATION || '')));
}

config.connectSocket(
  app.listen(process.env.PORT, () => console.log(`Server started on port ${process.env.PORT}`)),
);
