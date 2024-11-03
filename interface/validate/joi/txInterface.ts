import Joi from 'joi'

// Validator for memPoolInterface to ensure valid transaction data
export const txInterfaceValidator = Joi.object({
	amount: Joi.number()
		.required()
		.positive() // Memastikan nilai positif
		.min(0.999) // Memastikan minimal 1 Nexu
		.unsafe(true)
		.messages({
			'number.base': '"amount" must be a number',
			'number.positive': '"amount" must be a positive number',
			'number.min': '"amount" must be at least 1 nexu',
		}),
	format: Joi.string().valid('nexu').required(),
	sender: Joi.string().required(),
	receiver: Joi.string().required(),
	isContractTx: Joi.boolean().required(),
	sign: Joi.object({
		r: Joi.string().required(),
		s: Joi.string().required(),
		v: Joi.number().required(),
	}).required(),
	timestamp: Joi.number().required(),
	txHash: Joi.string().required(),
	message: Joi.any().optional(),
	fee: Joi.number().optional().unsafe(true),
	status: Joi.string().optional(),
	isValid: Joi.boolean().optional(),
	isPending: Joi.boolean().optional(),
	extraData: Joi.string().optional(),
	hexInput: Joi.string().optional(),
})
