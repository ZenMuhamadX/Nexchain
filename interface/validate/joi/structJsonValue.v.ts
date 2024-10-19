import Joi from 'joi'

export const structJsonValidate = Joi.object({
	to: Joi.string().required(), // The recipient of the transaction
	from: Joi.string().required(), // The sender of the transaction
	amount: Joi.number().required(), // The amount of cryptocurrency being transferred
	timestamp: Joi.string().required(), // The timestamp of when the transaction was created
	status: Joi.string().required(), // The status of the transaction (optional)
})
