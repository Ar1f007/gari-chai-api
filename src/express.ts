import compression from 'compression';
import cookieParser from 'cookie-parser';
import express from 'express';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import rateLimit from 'express-rate-limit';

import AppError from './utils/appError';
import routes from './utils/routes';
import { globalErrorHandler } from './middleware';

const configureExpressApp = () => {
  const app = express();

  // Set security HTTP headers
  app.use(helmet());

  // Limit requests from same API
  const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP, please try again in an hour!',
  });

  app.use('/api', limiter);

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(cookieParser());

  app.use(mongoSanitize());

  app.use(compression());

  // ROUTES
  routes(app);

  app.all('*', (req, res: any, next) => {
    const err = new AppError(`Can't find ${req.originalUrl} on the server!`, 404);
    next(err);
  });

  app.use(globalErrorHandler);
  return app;
};
export default configureExpressApp;
