/**
 * This module provides functions to handle different types of events in a Node.js server application.
 * These functions are responsible for gracefully shutting down the server in case of uncaught exceptions,
 * unhandled rejections, and termination signals.
 */

import { Server } from 'http';
import logger from './logger';
import { MongooseError } from 'mongoose';

/**
 * Gracefully closes the server by calling its `close` method.
 * If an error occurs while closing the server, it is logged using the provided logger and the process is exited with code 1.
 * @param server - The HTTP server instance that needs to be closed.
 */
function closeServer(server: Server) {
  server.close((error) => {
    if (error) {
      logger.error('Error occurred while closing server', error);
    }
    process.exit(1);
  });
}

/**
 * Handles uncaught exceptions by logging the error details and shutting down the process.
 * The error name, message, and stack trace are logged using the provided logger.
 * The process is then exited with code 1.
 */
export function handleUncaughtException() {
  process.on('uncaughtException', (err: unknown) => {
    const timestamp = new Date().toISOString();

    if (err instanceof Error || err instanceof MongooseError) {
      console.error(`${timestamp} - ${err.name}: ${err.message}`);
      logger.error(`${timestamp} - ${err.name}: ${err.message}`);
      logger.error('Exception origin', err.stack);
    }

    logger.error(`${timestamp} - Uncaught Exception occurred!`);

    process.exit(1);
  });
}

/**
 * Handles unhandled promise rejections by logging the rejection reason and shutting down the server.
 * The reason and promise details are logged using the provided logger.
 * The server is closed by calling the `closeServer` function.
 * @param server - The HTTP server instance that needs to be closed.
 */
export function handleUnhandledRejection(server: Server) {
  process.on('unhandledRejection', (reason: string, promise: Promise<any>) => {
    logger.error('Unhandled rejection occurred! Shutting down');
    logger.error('Reason:', reason);
    logger.error('Promise:', promise);

    closeServer(server);
  });
}

/**
 * Handles the SIGINT signal (usually triggered by pressing Ctrl+C) by calling the `closeServer` function.
 * @param server - The HTTP server instance that needs to be closed.
 */
export function handleSIGINT(server: Server) {
  process.on('SIGINT', () => {
    closeServer(server);
  });
}

/**
 * Handles the SIGTERM signal (usually triggered by a termination command) by calling the `closeServer` function.
 * @param server - The HTTP server instance that needs to be closed.
 */
export function handleSIGTERM(server: Server) {
  process.on('SIGTERM', () => {
    closeServer(server);
  });
}
