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

  const contacts = await contactModelsFind(page, perPage, sortOrder, sortBy);
  // console.log(contacts);

  res.send({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

export const oneContactController = async (req, res, next) => {
  const { contactId } = req.params;

  const contact = await contactModelsFindById(contactId);

  if (contact === null) {
    return next(createHttpError(404, 'Contact not found'));
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

  const deletedContact = await deleteContact(contactId);

  if (deletedContact === null) {
    return next(createHttpError(404, 'Contact not found'));
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

  const updatedContact = await updateContact(contactId, contact);

  if (updatedContact === null) {
    return next(createHttpError(404, 'Contact not found'));
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

  const updatedContact = await pumpingWithPatch(contactId, req.body);

  if (updatedContact.value === null) {
    return next(createHttpError(404, 'Contact not found'));
  }

  res.send({
    status: 200,
    message: 'Successfully patched a contact!',
    data: updatedContact.value,
  });
};
