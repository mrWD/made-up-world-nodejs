import cors from 'cors';

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
    console.log(origin);

    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};

const connectCors = cors(corsOptions);

export default connectCors;
