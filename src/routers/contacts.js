import express from 'express';
import { Router } from 'express';
import {
  fullContactsController,
  oneContactController,
  createContactController,
  deleteContactController,
  putContactController,
  patchContactController,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const router = Router();

const jsonParse = express.json({
  type: ['application/json', 'application/vnd.api+json'],
  //   limit: '100kb',
});

router.get('/contacts', ctrlWrapper(fullContactsController));

router.get(
  '/contacts/:contactId',
  jsonParse,
  ctrlWrapper(oneContactController),
);

router.post('/contacts', jsonParse, ctrlWrapper(createContactController));

router.delete(
  '/contacts/:contactId',
  jsonParse,
  ctrlWrapper(deleteContactController),
);

router.put(
  '/contacts/:contactId',
  jsonParse,
  ctrlWrapper(putContactController),
);

router.patch(
  '/contacts/:contactId',
  jsonParse,
  ctrlWrapper(patchContactController),
);

export default router;
