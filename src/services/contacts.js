import { ContactModels } from '../models/contacts.js';

export const fullContacts = async (req, res) => {
  try {
    const contacts = await ContactModels.find();

    res.send({
      status: 200,
      message: 'Successfully found contacts!',
      data: contacts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Something went wrong');
  }
};

export const oneContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contact = await ContactModels.findById(contactId);

    if (contact === null) {
      res.status(404).send({
        message: 'Contact not found',
      });
    }

    res.send({
      status: 200,
      message: `Successfully found contact with id ${contactId}!`,
      data: contact,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Something went wrong');
  }
};
