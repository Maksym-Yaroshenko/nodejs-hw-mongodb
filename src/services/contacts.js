// import mongoose from 'mongoose';
import { ContactModels } from '../models/contacts.js';

// export const fullContacts = async (req, res) => {
//   const contacts = await ContactModels.find();

//   res.send({
//     status: 200,
//     message: 'Successfully found contacts!',
//     data: contacts,
//   });

//   console.error(error);
//   res.status(500).send('Something went wrong');
// };

// export const oneContact = async (req, res, next) => {
//   const { contactId } = req.params;

//   if (!mongoose.Types.ObjectId.isValid(contactId)) {
//     return res.status(400).send({ message: 'Invalid contact ID format' });
//   }

//   const contact = await ContactModels.findById(contactId);

//   if (contact === null) {
//     return res.status(404).send({
//       message: 'Contact not found',
//     });
//   }

//   res.send({
//     status: 200,
//     message: `Successfully found contact with id ${contactId}!`,
//     data: contact,
//   });
//   console.error(error);
//   res.status(500).send('Something went wrong');
// };

export const contactModelsFind = () => {
  return ContactModels.find();
};

export const contactModelsFindById = (contactId) => {
  return ContactModels.findById(contactId);
};

export const createContact = (payload) => {
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
    versionKey: false,
  });
};

export const pumpingWithPatch = (contactId, payload, options = {}) => {
  return ContactModels.findByIdAndUpdate(contactId, payload, {
    new: true,
    includeResultMetadata: true,
    versionKey: false,
  });
};
