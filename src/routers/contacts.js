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
import { validateBody } from '../middlewares/validateBody.js';
import { createContactsSchema } from '../validation/contacts.js';
import { isValidId } from '../middlewares/isValidId.js';
import { authenticate } from '../middlewares/authenticate.js';

const router = Router();

const jsonParse = express.json({
  type: ['application/json', 'application/vnd.api+json'],
  //   limit: '100kb',
});

router.use(authenticate);

router.get('/', ctrlWrapper(fullContactsController));

router.get(
  '/:contactId',
  jsonParse,
  isValidId,
  ctrlWrapper(oneContactController),
);

router.post(
  '/',
  jsonParse,
  validateBody(createContactsSchema),
  ctrlWrapper(createContactController),
);

router.delete(
  '/:contactId',
  jsonParse,
  isValidId,
  ctrlWrapper(deleteContactController),
);

router.put(
  '/:contactId',
  jsonParse,
  isValidId,
  ctrlWrapper(putContactController),
);

router.patch(
  '/:contactId',
  jsonParse,
  isValidId,
  validateBody(createContactsSchema),
  ctrlWrapper(patchContactController),
);

export default router;
