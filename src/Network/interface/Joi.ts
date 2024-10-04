import Joi from 'joi'

export const ComValidate = Joi.object({
	type: Joi.string().required(),
	header: Joi.object({
		nodeId: Joi.number().required(),
		timestamp: Joi.number().required(),
		version: Joi.string().required(),
	}),
	data: Joi.any().required(),
})
