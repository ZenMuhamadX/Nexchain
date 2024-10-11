import Joi from 'joi'

export const COMValidate = Joi.object({
	type: Joi.string().required(),
	payload: Joi.any().required(),
	nodeSender: Joi.string().required(),
	timestamp: Joi.number().required(),
})
