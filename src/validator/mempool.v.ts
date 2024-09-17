import Joi from 'joi'

// Validator for memPoolInterface to ensure valid transaction data
export const memPoolInterfaceValidator = Joi.object({
	amount: Joi.number().required(), // The amount of cryptocurrency being transferred
	from: Joi.string().required(), // The address of the sender
	to: Joi.string().required(), // The address of the recipient
	signature: Joi.string().required(), // The digital signature of the transaction
	timestamp: Joi.string().required(), // The timestamp when the transaction was created
	txHash: Joi.string().required(), // The hash of the transaction
	message: Joi.string().optional(), // An optional message included with the transaction
})
