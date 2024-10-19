import Joi from 'joi'

export const structBalanceValidate = Joi.object({
	balance: Joi.number().required(),
	nonce: Joi.number().optional(),
})
