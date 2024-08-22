import express from 'express';
import pino from 'pino-http';
import cors from 'cors';

import { env } from './utils/env.js';
import { fullContacts, oneContact } from './services/contacts.js';

export const setupServer = () => {
  const app = express();

  const PORT = env('PORT', '3000');

  app.use(express.json());

  app.use(cors());

  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  app.get('/', (req, res, next) => {
    res.send('Good!');
  });

  app.get('/contacts', fullContacts);

  app.get('/contacts/:contactId', oneContact);

  app.use('*', (req, res, next) => {
    res.status(404).json({
      message: 'Not found',
    });
  });

  app.use((err, req, res, next) => {
    res.status(500).json({
      message: 'Something went wrong',
    });
  });

  app.listen(3000, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
