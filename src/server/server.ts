import * as dotenv from 'dotenv';
const env = process.env.NODE_ENV || 'development';
dotenv.config({ path: `${process.cwd()}/.env${env === 'test' ? '.test' : ''}` });

import 'reflect-metadata';
import * as express from 'express';
import * as os from 'os';
import * as http from 'http';
import * as https from 'https';
import * as fs from 'fs';

import { RoutesConf } from './config/routes.conf';
import { CorsConf } from './config/cords.conf';
import { Routes } from './routes/index';
import { createConnection } from 'typeorm';

const app = express();
const ssl = process.env.SSL_STATUS || 'false';
const PORT = process.env.PORT || 3331;
let server: any;

CorsConf.init(app);
RoutesConf.init(app);
Routes.init(app);

if (ssl === 'true') {
  const key = process.env.SSL_KEY;
  const crt = process.env.SSL_CERT;
  const ca = process.env.SSL_CA;

  const opts = {
    key: fs.readFileSync(key),
    cert: fs.readFileSync(crt),
    ca: fs.readFileSync(ca),
  };
  server = https.createServer(opts, app);
} else {
  server = http.createServer(app);
}

if (env !== 'test') {
  createConnection()
    .then(() => {
      server.listen(PORT, () => {
        console.log(`up and running @: ${os.hostname()} on port: ${PORT}`);
        console.log(`enviroment: ${env}`);
      });
    })
    .catch((e) => console.error(e));
}

export default server;
export { app };
