import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { env } from './utils/env.js';
import router from './routers/index.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { UPLOAD_DIR } from './constants/index.js';

export const setupServer = () => {
  const app = express();

  const PORT = env('PORT', '3000');

  app.use(
    express.json({
      type: ['application/json', 'application/vnd.api+json'],
      // limit: '100kb',
    }),
  );

  app.use('/uploads', express.static(UPLOAD_DIR));

  app.use(cors());
  app.use(cookieParser());

  // app.use(
  //   pino({
  //     transport: {
  //       target: 'pino-pretty',
  //     },
  //   }),
  // );

  app.get('/', (req, res, next) => {
    res.send('Good!');
  });

  app.use(router);

  app.use('*', notFoundHandler);

  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
