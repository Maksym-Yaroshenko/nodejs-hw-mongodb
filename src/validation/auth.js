import Joi from 'joi';

export const registerUserSchema = Joi.object({
  name: Joi.string().min(3).max(30).trim().required(),
  email: Joi.string().email().min(3).max(30).trim().required(),
  password: Joi.string().min(3).max(30).trim().required(),
});

export const loginUserSchema = Joi.object({
  email: Joi.string().email().min(3).max(30).trim().required(),
  password: Joi.string().min(3).max(30).trim().required(),
});
