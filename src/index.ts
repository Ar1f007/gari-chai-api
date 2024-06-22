import { envVariables } from './utils/env';
import { handleSIGINT, handleSIGTERM, handleUncaughtException, handleUnhandledRejection } from './utils/eventHandlers';
import configureExpressApp from './config/configureExpressApp';
import connect from './utils/connect';
import logger from './utils/logger';

handleUncaughtException();

async function startServer() {
  const app = configureExpressApp();

  const PORT = envVariables.PORT || 8000;

  try {
    await connect();
    const server = app.listen(PORT, () => {
      logger.info('listening on port ' + PORT);
    });

    handleUnhandledRejection(server);
    handleSIGINT(server);
    handleSIGTERM(server);
  } catch (error) {
    logger.error('Error connecting to the database:', error);
    process.exit(1);
  }
}

startServer();
