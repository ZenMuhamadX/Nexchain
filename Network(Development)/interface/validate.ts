import Joi from 'joi'

export const COMValidate = Joi.object({
	type: Joi.string().required(),
	payload: Joi.object({
		data: Joi.any().required(),
	}).required(),
	messageId: Joi.string().required(),
	timestamp: Joi.number().required(),
	isClient: Joi.boolean().required(),
	forwardCount: Joi.number().required(),
})
