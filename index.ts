import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import session from 'express-session';
import dotenv from 'dotenv';

import config from './src/config';
import routes from './src/routes';

dotenv.config();

const app = express();

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
app.use(cors());

app.get(`/api/${process.env.DESTINATION}/:year/:month/:day/:name`, (req, res) => {
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

app.use('/api/auth', routes.auth);
app.use('/api/users', routes.users);
app.use('/api/editing', routes.editing);
app.use('/api/reading', routes.reading);
app.use('/api/push', routes.pushNotification);
app.use('/api/upload', routes.upload);
app.use('/api/chats', routes.chats);

if (process.env.NODE_ENV === 'pruduction') {
  app.get('/', (req, res) => res.send('API is running!'));
  // app.get('/', (req, res) => res.sendFile(`${__dirname}/views/index.html`));
  // app.use(express.static(`${__dirname}/public/`));

  // app.get('/uploads', (req, res) => res.sendFile(path.join(__dirname, process.env.DESTINATION || '')));
}

config.connectSocket(
  app.listen(process.env.PORT, () => console.log(`Server started on port ${process.env.PORT}`)),
);
