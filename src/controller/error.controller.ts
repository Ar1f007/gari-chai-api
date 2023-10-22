import mongoose from 'mongoose';
import { ErrorRequestHandler, Response } from 'express';
import AppError from '../utils/appError';
import { envVariables } from '../schema/env';

function sendErrorDev(res: Response, err: AppError) {
  return res.status(err.statusCode).json({
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
      });
    }
  }

  return res.status(500).json({
    status: 'error',
    message: 'Something went wrong! Please try again later.',
  });
}

function handleCastErrorDB(err: mongoose.Error.CastError) {
  const msg = `Invalid value for ${err.path}: ${err.value}!`;
  return new AppError(msg, 400);
}

function handleDuplicateFieldsDB(err: any) {
  const name = err.keyValue.name;

  const msg = `Duplicate field value: ${name}. Please use another value!`;

  return new AppError(msg, 400);
}

function handleValidationErrorDB(err: mongoose.Error.ValidationError) {
  const errors = Object.values(err.errors).map((el) => el.message);

  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
}

export const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (err instanceof AppError) {
    err.statusCode = err.statusCode || 500;
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
