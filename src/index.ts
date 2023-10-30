import { envVariables } from './utils/env';
import connect from './utils/connect';
import logger from './utils/logger';
import { handleSIGINT, handleSIGTERM, handleUncaughtException, handleUnhandledRejection } from './utils/eventHandlers';
import configureExpressApp from './config/configureExpressApp';

handleUncaughtException();

const app = configureExpressApp();

const PORT = envVariables.PORT;

const server = app.listen(PORT, async () => {
  logger.info('listening on port ' + PORT);

  await connect();
});

handleUnhandledRejection(server);
handleSIGINT(server);
handleSIGTERM(server);
