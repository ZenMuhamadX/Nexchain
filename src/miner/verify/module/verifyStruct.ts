import { generateTimestampz } from '../../../lib/timestamp/generateTimestampz'
import { loggingErr } from '../../../logging/errorLog'
import { Block } from '../../../model/blocks/block'
import Joi from 'joi'

export const verifyStruct = (block:Block) => {
	const structBlock = Joi.object({
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
	if (structBlock.validate(block).error) {
		loggingErr({
			error: structBlock.validate(block).error,
			stack: structBlock.validate(block).error?.stack,
			time: generateTimestampz(),
			warning: structBlock.validate(block).warning?.message,
		})
		return false
	}
	return true
}
