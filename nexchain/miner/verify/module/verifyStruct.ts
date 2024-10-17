import { Block } from 'nexchain/model/blocks/block'
import { generateTimestampz } from '../../../lib/timestamp/generateTimestampz'
import { loggingErr } from '../../../../logging/errorLog'
import Joi from 'joi'
import _ from 'lodash'

// Function to verify the structure of a block using Joi schema validation
export const verifyStruct = async (chains: Block) => {
	// Define the schema for the MemPoolInterface
	const memPoolInterfaceSchema = Joi.object({
		to: Joi.string().required(),
		from: Joi.string().required(),
		amount: Joi.number().required(),
		txHash: Joi.string().required(),
		timestamp: Joi.number().required(),
		signature: Joi.string().required(),
		message: Joi.any().optional(),
		fee: Joi.number().required(),
		status: Joi.string().required(),
		isPending: Joi.boolean().required(),
		isValidate: Joi.boolean().required(),
	})

	// Define the schema for the coinbaseTransaction object
	const coinbaseTransactionSchema = Joi.object({
		to: Joi.string().required(),
		amount: Joi.number().required(),
		reward: Joi.number().required(),
	})

	// Define the schema for the validator object
	const validatorSchema = Joi.object({
		rewardAddress: Joi.string().required(),
		stakeAmount: Joi.number().optional(),
		validationTime: Joi.number().optional(),
	})

	// Define the schema for the metadata object
	const metadataSchema = Joi.object({
		txCount: Joi.number().required(),
		gasPrice: Joi.number().required(),
		created_at: Joi.number().required(),
		notes: Joi.any().optional(), // Use .optional() if it's not required
	})

	// Define the schema for the blockStruct interface
	const blockStructSchema = Joi.object({
		header: Joi.object({
			previousBlockHash: Joi.string().required(),
			timestamp: Joi.number().required(),
			hash: Joi.string().required(),
			nonce: Joi.number().required(),
			version: Joi.string().required(),
			difficulty: Joi.number().required(),
			hashingAlgorithm: Joi.string().optional(),
		}).required(),
		height: Joi.number().required(),
		signature: Joi.string().required(),
		size: Joi.number().required(),
		totalTransactionFees: Joi.any().optional(),
		merkleRoot: Joi.string().required(),
		networkId: Joi.string().required(),
		status: Joi.valid('confirmed', 'pending').required(),
		blockReward: Joi.any().required(),
		coinbaseTransaction: coinbaseTransactionSchema.required(),
		validator: validatorSchema.required(),
		metadata: metadataSchema.optional(), // Use .optional() if metadata is not required
		transactions: Joi.array().items(memPoolInterfaceSchema).required(),
	})
	// Validate the block structure against the schema
	const { error, warning } = blockStructSchema.validate(chains.block)
	if (error) {
		loggingErr({
			error,
			stack: new Error().stack,
			time: generateTimestampz(),
			warning: warning?.message,
			context: 'Block verifyStruct',
			hint: 'Invalid block structure',
		})
		return false // Structure is invalid
	}
	return true
}
