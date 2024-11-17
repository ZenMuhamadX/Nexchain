import { Block } from 'nexchain/model/block/block'
import { generateTimestampz } from '../../../lib/generateTimestampz'
import { loggingErr } from '../../../../logging/errorLog'
import Joi from 'joi'
import _ from 'lodash'

// Function to verify the structure of a block using Joi schema validation
export const verifyStruct = async (chains: Block) => {
	// Define the schema for the MemPoolInterface
	const txInterface = Joi.object({
		format: Joi.string().required(),
		sender: Joi.string().required(),
		receiver: Joi.string().required(),
		amount: Joi.number().required().unsafe(),
		txHash: Joi.string().required(),
		timestamp: Joi.number().required(),
		sign: Joi.object({
			r: Joi.string().required(),
			s: Joi.string().required(),
			v: Joi.number().required(),
		}).required(),
		extraData: Joi.any().optional(),
		fee: Joi.number().required().unsafe(),
		status: Joi.string().required(),
		isPending: Joi.boolean().required(),
		isValid: Joi.boolean().required(),
		isReceiverContract: Joi.boolean().required(),
		isSenderContract: Joi.boolean().required(),
		hexInput: Joi.string().required(),
	})

	// Define the schema for the coinbaseTransaction object
	const coinbaseTransactionSchema = Joi.object({
		receiver: Joi.string().required(),
		amount: Joi.number().required().unsafe(),
		extraData: Joi.any().optional(),
	})

	// Define the schema for the metadata object
	const metadataSchema = Joi.object({
		txCount: Joi.number().required(),
		gasPrice: Joi.number().required(),
		created_at: Joi.number().required(),
		extraData: Joi.any().optional(), // Use .optional() if it's not required
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
		sign: Joi.object({
			r: Joi.string().required(),
			s: Joi.string().required(),
			v: Joi.number().required(),
		}).required(),
		chainId: Joi.number().required(),
		size: Joi.number().required(),
		totalTransactionFees: Joi.any().optional(),
		merkleRoot: Joi.string().required(),
		minerId: Joi.string().required(),
		totalReward: Joi.number().required().unsafe(true),
		status: Joi.valid('confirmed', 'pending').required(),
		blockReward: Joi.any().required(),
		coinbaseTransaction: coinbaseTransactionSchema.required(),
		metadata: metadataSchema.optional(), // Use .optional() if metadata is not required
		transactions: Joi.array().items(txInterface).required(),
		contract: Joi.any(),
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
