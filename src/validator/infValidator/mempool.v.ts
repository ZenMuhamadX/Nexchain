import Joi from "joi";

export const memPoolInterfaceVlaidator = Joi.object({
	amount: Joi.number().required(),
	from: Joi.string().required(),
	to: Joi.string().required(),
	signature: Joi.string().required(),
	timestamp: Joi.string().required(),
    txHash: Joi.string().required(),
    message: Joi.string().optional(),
});