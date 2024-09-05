import Joi from 'joi';

export const createContactsSchema = Joi.object({
  name: Joi.string().min(3).max(20).alphanum().trim().required(),
  phoneNumber: Joi.string().min(3).max(20).trim().required(),
  email: Joi.string().email().min(3).max(20).trim().lowercase(),
  isFavourite: Joi.boolean(),
  contactType: Joi.string().valid('work', 'home', 'personal').required(),
});
