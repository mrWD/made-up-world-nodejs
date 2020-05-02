import express from 'express';
import { SessionOptions } from 'express-session';
import connectMongo from 'connect-mongo';
import mongoose from 'mongoose';

import mocks from '../mocks';

interface Session {
  (options?: SessionOptions): express.RequestHandler;
}

const connectDB = (session: Session): connectMongo.MongoStore => {
  const MongoStore = connectMongo(session);

  mongoose.Promise = global.Promise;
  mongoose.set('debug', process.env.NODE_ENV === 'production');
  mongoose.connection
    .on('error', error => console.log(error))
    .on('close', () => console.log('Database connection closed.'))
    .once('open', () => {
      const info = mongoose.connections[0];
      console.log(`Connected to ${info.host}:${info.port}/${info.name}`);

      mocks.stories();
      mocks.sendPush();
    });
  mongoose.connect(process.env.MONGO_URL || '', {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  });

  return new MongoStore({
    mongooseConnection: mongoose.connection,
  })
};

export default connectDB;
