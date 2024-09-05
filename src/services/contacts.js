// import mongoose from 'mongoose';
import { SORT_ORDER } from '../constants/index.js';
import { ContactModels } from '../models/contacts.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export const contactModelsFind = async (
  page = 1,
  perPage = 10,
  sortOrder = SORT_ORDER.ASD,
  sortBy = '_id',
) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  const contactsQuery = ContactModels.find();

  const [contactsCount, contacts] = await Promise.all([
    ContactModels.countDocuments({}),
    contactsQuery
      .skip(skip)
      .limit(limit)
      .sort({ [sortBy]: sortOrder })
      .exec(),
  ]);

  const peginationData = calculatePaginationData(contactsCount, page, perPage);

  return {
    data: contacts,
    ...peginationData,
  };

  // return ContactModels.find();
};

export const contactModelsFindById = (contactId) => {
  return ContactModels.findById(contactId);
};

export const createContact = (payload, qqq, options = {}) => {
  return ContactModels.create(payload);
};

export const deleteContact = (contactId) => {
  return ContactModels.findByIdAndDelete(contactId);
};

export const updateContact = (contactId, payload, options = {}) => {
  return ContactModels.findByIdAndUpdate(contactId, payload, {
    new: true,
    upsert: true,
    includeResultMetadata: true,
    // versionKey: false,
  });
};

export const pumpingWithPatch = (contactId, payload, options = {}) => {
  return ContactModels.findByIdAndUpdate(contactId, payload, {
    new: true,
    includeResultMetadata: true,
    // versionKey: false,
  });
};
