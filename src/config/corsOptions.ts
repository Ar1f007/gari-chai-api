import { CorsOptions } from 'cors';

const whitelist = [
  'https://gari-chai.vercel.app',
  'https://gari-chai-admin.vercel.app',
  'http://localhost:3000',
  'http://localhost:8080',
  'https://www.garichaibd.com',
  'https://gari-chai-admin-git-main-ar1f007s-projects.vercel.app',
  'https://gari-chai-admin-ar1f007s-projects.vercel.app',
  'https://gari-chai-git-main-ar1f007s-projects.vercel.app',
  'https://gari-chai-ar1f007s-projects.vercel.app',
  'admin.garichaibd.com',
  'https://admin.garichaibd.com',
  'www.garichaibd.com',
  'garichaibd.com',
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
  optionsSuccessStatus: 200,
};
