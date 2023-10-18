import express from 'express';

import compression from 'compression';
import helmet from 'helmet';

const expressConfig = () => {
  const app = express();

  app.use(compression());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  app.use(helmet());

  return app;
};
export default expressConfig;
