import * as express from 'express';
import * as morgan from 'morgan';
import * as bodyParser from 'body-parser';
import * as helmet from 'helmet';
import * as compression from 'compression';
import * as zlib from 'zlib';
import * as fs from 'fs';
import * as path from 'path';
import * as rfs from 'rotating-file-stream';
import * as rateLimit from 'express-rate-limit';
import { unCoughtErrorHandler } from '@/handler/error-handler';

export class RoutesConf {
  static init(application: express.Application): void {
    const root = process.cwd();
    const nodeModules = '/node_modules/';
    const publicFiles = '/src/storage/public/';
    const uploadFile = '/src/storage/upload/';
    const logDirectory = path.join(root, '/src/storage/logs/access');
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 1000, // limit each IP to 100 requests per windowMs
      deplayMs: 0, // disables delays
    });

    // ensure log directory exists
    fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

    // create a rotating write stream
    const accessLogStream = rfs.default('access.log', {
      interval: '1d', // rotate daily
      path: logDirectory,
    });

    application.use(
      compression({
        level: zlib.Z_BEST_COMPRESSION,
        threshold: '1kb',
      }),
    );

    application.use(express.static(root + nodeModules));
    application.use(express.static(root + publicFiles));
    application.use(express.static(root + uploadFile));
    application.use(bodyParser.urlencoded({ extended: true }));
    application.use(bodyParser.json({ limit: '10mb' }));
    application.use(
      morgan('combined', {
        stream: accessLogStream,
      }),
    );
    application.use(helmet());
    application.use(limiter); //  apply to all requests
    application.use(unCoughtErrorHandler);
  }
}
