import express from 'express';
import pino from 'pino-http';
import cors from 'cors';

import { env } from './utils/env.js';
import contactsRouter from './routers/contacts.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';

export const setupServer = () => {
  const app = express();

  const PORT = env('PORT', '3000');

  // app.use(
  //   express.json({
  //     type: ['application/json', 'application/vnd.api+json'],
  //     limit: '100kb',
  //   }),
  // );

  app.use(cors());

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

  app.use(contactsRouter);

  app.use('*', notFoundHandler);

  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
