import expressConfig from './config/express';
import logger from './utils/logger';

const app = expressConfig();

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  logger.info('listening...');
});
