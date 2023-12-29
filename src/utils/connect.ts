import { envVariables } from './env';
import logger from './logger';
import mongoose from 'mongoose';

async function connect() {
  try {
    await mongoose.connect(envVariables.DB_URI);

    logger.info('DB connected');

    return true;
  } catch (e) {
    logger.fatal('Could not connect to DB');
    process.exit(1);
  }
}

export default connect;
