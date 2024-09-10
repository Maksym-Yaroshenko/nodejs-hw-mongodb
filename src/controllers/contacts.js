import mongoose from 'mongoose';
import {
  contactModelsFind,
  contactModelsFindById,
  createContact,
  deleteContact,
  pumpingWithPatch,
  updateContact,
} from '../services/contacts.js';
import createHttpError from 'http-errors';
import { parsePaginationsParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';

export const fullContactsController = async (req, res, next) => {
  const { page, perPage } = parsePaginationsParams(req.query);

  const { sortOrder, sortBy } = parseSortParams(req.query);
  // console.log(req.user);

  const contacts = await contactModelsFind(
    page,
    perPage,
    sortOrder,
    sortBy,
    req.user._id,
  );
  // console.log(contacts);

  res.send({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

export const oneContactController = async (req, res, next) => {
  const { contactId } = req.params;

  const contact = await contactModelsFindById(contactId, req.user._id);

  if (!contact || contact.userId.toString() !== req.user._id.toString()) {
    return next(
      createHttpError(404, 'Contact not found or you do not have access to it'),
    );
  }

  res.send({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
};

export const createContactController = async (req, res, next) => {
  const contact = {
    name: req.body.name,
    phoneNumber: req.body.phoneNumber,
    email: req.body.email,
    isFavourite: req.body.isFavourite,
    contactType: req.body.contactType,
    userId: req.user._id,
  };

  const createdContact = await createContact(contact);
  res.status(201).send({
    status: 201,
    message: 'Successfully created a contact!',
    data: createdContact,
  });
};

export const deleteContactController = async (req, res, next) => {
  const { contactId } = req.params;

  const deletedContact = await deleteContact(contactId, req.user._id);

  if (
    !deletedContact ||
    deletedContact.userId.toString() !== req.user._id.toString()
  ) {
    return next(
      createHttpError(404, 'Contact not found or you do not have access to it'),
    );
  }

  res.status(204).send();
};

export const putContactController = async (req, res, next) => {
  const { contactId } = req.params;

  const { name, phoneNumber, email, isFavourite, contactType } = req.body;

  const contact = {
    name,
    phoneNumber,
    email,
    isFavourite,
    contactType,
  };

  const updatedContact = await updateContact(contactId, req.user._id, contact);

  if (
    !updatedContact.value ||
    updatedContact.value.userId.toString() !== req.user._id.toString()
  ) {
    return next(
      createHttpError(404, 'Contact not found or you do not have access to it'),
    );
  }

  // console.log() {

  if (updatedContact.lastErrorObject.updatedExisting === true) {
    return res.send({
      status: 200,
      message: `Successfully update contact with id ${contactId}`,
      data: updatedContact.value,
    });
  }

  res.status(201).send({
    status: 201,
    message: `Successfully created contact with id ${contactId}`,
    data: updatedContact.value,
  });
};

export const patchContactController = async (req, res, next) => {
  const { contactId } = req.params;

  const updatedContact = await pumpingWithPatch(
    contactId,
    req.user._id,
    req.body,
  );

  if (
    !updatedContact.value ||
    updatedContact.value.userId.toString() !== req.user._id.toString()
  ) {
    return next(
      createHttpError(404, 'Contact not found or you do not have access to it'),
    );
  }
  res.send({
    status: 200,
    message: 'Successfully patched a contact!',
    data: updatedContact.value,
  });
};
