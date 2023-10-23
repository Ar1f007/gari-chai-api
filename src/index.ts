import connect from './utils/connect';
import expressConfig from './config/express';
import logger from './utils/logger';

import { envVariables } from './utils/env';
import { handleSIGINT, handleSIGTERM, handleUncaughtException, handleUnhandledRejection } from './utils/eventHandlers';

handleUncaughtException();

const app = expressConfig();

const PORT = envVariables.PORT;

const server = app.listen(PORT, async () => {
  logger.info('listening on port ' + PORT);

  await connect();
});

handleUnhandledRejection(server);
handleSIGINT(server);
handleSIGTERM(server);
