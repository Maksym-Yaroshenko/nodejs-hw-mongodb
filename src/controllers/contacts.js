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

export const fullContactsController = async (req, res) => {
  const contacts = await contactModelsFind();

  res.send({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });

  //   console.error(error);

  //   res.status(500).send('Something went wrong');
};

export const oneContactController = async (req, res, next) => {
  const { contactId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(contactId)) {
    //   return res.status(400).send({ message: 'Invalid contact ID format' });
    // throw createHttpError(400, 'Invalid contact ID format');
    return next(createHttpError(400, 'Invalid contact ID format'));
  }

  const contact = await contactModelsFindById(contactId);

  if (contact === null) {
    // return res.status(404).send({
    //   message: 'Contact not found',
    // });
    // throw createHttpError(404, 'Contact not found');
    return next(createHttpError(404, 'Contact not found'));
  }

  res.send({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });

  //   console.error(error);
  //   res.status(500).send('Something went wrong');
};

export const createContactController = async (req, res, next) => {
  //   console.log(req.body);
  const contact = {
    name: req.body.name,
    phoneNumber: req.body.phoneNumber,
    email: req.body.email,
    isFavourite: req.body.isFavourite,
    contactType: req.body.contactType,
  };
  //   console.log(contact);

  const createdContact = await createContact(contact);
  // return createdContact;
  res.status(201).send({
    status: 201,
    message: 'Successfully created a contact!',
    data: createdContact,
  });
};

export const deleteContactController = async (req, res, next) => {
  const { contactId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(contactId)) {
    // throw createHttpError(400, 'Invalid contact ID format');
    return next(createHttpError(400, 'Invalid contact ID format'));
  }

  const deletedContact = await deleteContact(contactId);

  if (deletedContact === null) {
    return next(createHttpError(404, 'Contact not found'));
  }

  res.status(204).send();
};

export const putContactController = async (req, res, next) => {
  const { contactId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(contactId)) {
    // throw createHttpError(400, 'Invalid contact ID format');
    return next(createHttpError(400, 'Invalid contact ID format'));
  }

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

  if (!mongoose.Types.ObjectId.isValid(contactId)) {
    return next(createHttpError(400, 'Invalid contact ID format'));
  }

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
