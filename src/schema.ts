import * as Joi from 'joi';

export const configSchema = Joi.object({
  startDate: Joi.date().required().messages({
    'date.base': '"startDate" must be a valid date',
    'any.required': '"startDate" is required',
  }),
  age: Joi.number().integer().min(0).required().messages({
    'number.base': '"age" must be a number',
    'number.min': '"age" must be greater than or equal to 0',
    'any.required': '"age" is required',
  }),
  name: Joi.string().required().messages({
    'string.base': '"name" must be a string',
    'any.required': '"name" is required',
  }),
});
