import { Request, Response, NextFunction } from 'express';
import * as winston from 'winston';
import { ManageError } from '@/libs/manage-error';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    //
    // - Write to all logs with level `info` and below to `combined.log`
    // - Write all logs error (and below) to `error.log`.
    //
    new winston.transports.File({
      filename: 'src/storage/logs/error.log',
      level: 'error',
    }),
    new winston.transports.File({ filename: 'src/storage/logs/combined.log' }),
  ],
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  );
}

export function unCoughtErrorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  const manageError = new ManageError();

  console.error(err);
  logger.log(manageError.loggerLevel, JSON.stringify(err));
  res.status(manageError.status).json({ slug: manageError.slug, message: manageError.message });
}

export function apiErrorHandler(err: any, req: Request, res: Response) {
  let manageError: ManageError;
  if (err.slug) {
    manageError = err;
  } else {
    console.error(err);
    manageError = new ManageError();
  }

  const error: object = {
    slug: manageError.slug,
    message: manageError.message,
    Request: {
      url: req.url,
      method: req.method,
    },
    Stack: manageError.stack,
  };

  logger.log(manageError.loggerLevel, JSON.stringify(error));
  res.status(manageError.status).json({ slug: manageError.slug, message: manageError.message });
}
