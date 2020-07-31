import * as express from 'express';
import * as cors from 'cors';

/**
 * Constants
 */
import { headerConst } from '@/constants/header';

export class CorsConf {
  static init(application: express.Application): void {
    application.use(
      cors({
        origin: '*',
        optionsSuccessStatus: 204,
        methods: ['GET', 'HEAD', 'PUT', 'POST', 'DELETE', 'PATCH'],
        allowedHeaders: [
          'Content-Type',
          `${headerConst.PREFIX}Authorization`,
          'Content-Length',
          'X-Requested-With',
          'Content-disposition',
          `${headerConst.PREFIX}Client-Date`,
        ],
        exposedHeaders: ['Content-disposition', 'filename'],
      }),
    );
  }
}
