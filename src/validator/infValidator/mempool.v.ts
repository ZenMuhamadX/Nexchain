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
	fee: Joi.number().optional(), // The fee associated with the transaction (optional)
	status: Joi.string().optional(), // The status of the transaction (optional)
	pub: Joi.string().optional(), // The public key of the sender
})
