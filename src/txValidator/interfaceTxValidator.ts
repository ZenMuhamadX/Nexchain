import Joi from 'joi'

export const validatorIntercafeTx = Joi.object({
  amount: Joi.number().required(),
  sender: Joi.string().required(),
  recipient: Joi.string().required(),
  message: Joi.string().optional(),
})
