import Joi from 'joi'

export const validatorIntercafeTx = Joi.object({
	amount: Joi.number().required(),
	from: Joi.string().required(),
	to: Joi.string().required(),
	message: Joi.string().optional(),
})
