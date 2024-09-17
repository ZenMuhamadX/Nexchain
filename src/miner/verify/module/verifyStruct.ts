import { generateTimestampz } from '../../../lib/timestamp/generateTimestampz'
import { loggingErr } from '../../../logging/errorLog'
import { Block } from '../../../model/blocks/block'
import Joi from 'joi'

// Function to verify the structure of a block using Joi schema validation
export const verifyStruct = (block: Block): boolean => {
	// Define the schema for validating the block structure
	const blockSchema = Joi.object({
		blk: Joi.object({
			header: Joi.object({
				previousHash: Joi.string().required(),
				timestamp: Joi.string().required(),
				hash: Joi.string().required(),
				nonce: Joi.string().required(),
				version: Joi.string().required(),
				difficulty: Joi.number().required(),
			}),
			height: Joi.number().required(),
			signature: Joi.string().required(),
			size: Joi.string().required(),
			walletData: Joi.array()
				.items(
					Joi.object({
						address: Joi.string().required(),
						balance: Joi.number().required(),
						signature: Joi.string().required(),
					}),
				)
				.required(),
			transactions: Joi.array().optional(),
			reward: Joi.number().required(),
		}),
	})

	// Validate the block structure against the schema
	const { error, warning } = blockSchema.validate(block)

	if (error) {
		loggingErr({
			error,
			stack: error.stack,
			time: generateTimestampz(),
			warning: warning?.message,
		})
		return false // Structure is invalid
	}

	return true // Structure is valid
}
