// import mongoose from 'mongoose';
import { SORT_ORDER } from '../constants/index.js';
import { ContactModels } from '../models/contacts.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export const contactModelsFind = async (
  page = 1,
  perPage = 10,
  sortOrder = SORT_ORDER.ASD,
  sortBy = '_id',
  userId,
) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  const contactsQuery = ContactModels.find({ userId });

  const [contactsCount, contacts] = await Promise.all([
    ContactModels.countDocuments({ userId }),
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

export const contactModelsFindById = (contactId, userId) => {
  return ContactModels.findOne({ _id: contactId, userId });
};

export const createContact = (payload, qqq, options = {}) => {
  return ContactModels.create(payload);
};

export const deleteContact = (contactId, userId) => {
  return ContactModels.findByIdAndDelete({ _id: contactId, userId });
};

export const updateContact = (
  contactId,
  userId,
  payload,
  photoUrl,
  options = {},
) => {
  return ContactModels.findByIdAndUpdate(
    { _id: contactId, userId },
    {
      ...payload,
      photo: photoUrl,
    },
    {
      new: true,
      upsert: true,
      includeResultMetadata: true,
      // versionKey: false,
    },
  );
};

export const pumpingWithPatch = (
  contactId,
  userId,
  payload,
  photoUrl,
  options = {},
) => {
  return ContactModels.findByIdAndUpdate(
    { _id: contactId, userId },
    { ...payload, photo: photoUrl },
    {
      new: true,
      includeResultMetadata: true,
      // versionKey: false,
    },
  );
};
