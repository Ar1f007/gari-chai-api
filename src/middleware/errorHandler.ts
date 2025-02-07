import { ErrorRequestHandler, Response } from 'express';
import mongoose from 'mongoose';

import AppError from '../utils/appError';
import { envVariables } from '../utils/env';
import { StatusCodes } from 'http-status-codes';

function sendErrorDev(res: Response, err: any) {
  return res.status(err.StatusCodes ?? StatusCodes.INTERNAL_SERVER_ERROR).json({
    status: err.status,
    message: err.message,
    stackTrace: err.stack,
    error: err,
  });
}

function sendErrorProd(err: any, res: Response) {
  if (err instanceof AppError) {
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        statusCode: err.statusCode,
      });
    }
  }

  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    status: 'error',
    message: 'Something went wrong! Please try again later.',
  });
}

function handleCastErrorDB(err: mongoose.Error.CastError) {
  const msg = `Invalid value for ${err.path}: ${err.value}!`;
  return new AppError(msg, StatusCodes.BAD_REQUEST);
}

function handleDuplicateFieldsDB(err: any) {
  const name = err.keyValue.name || Object.keys(err.keyPattern)[0];

  const msg = `Value for: ${name} is already in use. Please use another value!`;

  return new AppError(msg, StatusCodes.BAD_REQUEST);
}

function handleValidationErrorDB(err: mongoose.Error.ValidationError) {
  const errors = Object.values(err.errors).map((el) => el.message);

  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, StatusCodes.BAD_REQUEST);
}

// eslint-disable-next-line no-unused-vars
export const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (err instanceof AppError) {
    err.statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
    err.status = err.status || 'error';
  }

  if (envVariables.NODE_ENV === 'development') {
    sendErrorDev(res, err);
  }

  if (envVariables.NODE_ENV === 'production') {
    if (err instanceof mongoose.Error.CastError) err = handleCastErrorDB(err);

    if (err instanceof mongoose.Error.ValidationError) err = handleValidationErrorDB(err);

    if (err.code === 11000) err = handleDuplicateFieldsDB(err);

    sendErrorProd(err, res);
  }
};
