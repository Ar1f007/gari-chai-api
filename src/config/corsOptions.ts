import { CorsOptions } from 'cors';

const whitelist = [
  'https://gari-chai.vercel.app',
  'https://gari-chai-admin.vercel.app',
  'http://localhost:3000',
  'http://localhost:8080',
];

export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};
