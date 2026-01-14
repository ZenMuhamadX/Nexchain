import { generateTimestampz } from 'nexchain core/lib/generateTimestampz'
import { Block } from 'nexchain core/model/block/block'
import { rocksState } from 'nexchain core/db/state'
import { stringToHex } from 'nexchain core/hex/stringToHex'
import { JSONStringify } from 'nexchain core/lib/JSONStringify'
import { bigIntToString } from 'nexchain core/savers/lib/bigintToString'

export interface blockState {
	currentBlockHeight: number
	prevBlockHash: string
	currentBlockHash: string
	currentTimestamp: number
	blockReward: string
	lastUpdated: number
	currentBlockSize: number
}

export const setBlockState = async (block: Block) => {
	const convertedBlock = bigIntToString(block)
	const blockState: blockState = {
		currentBlockSize: convertedBlock.block.size,
		prevBlockHash: convertedBlock.block.header.previousBlockHash,
		currentBlockHash: convertedBlock.block.header.hash,
		currentBlockHeight: convertedBlock.block.height,
		currentTimestamp: convertedBlock.block.header.timestamp,
		lastUpdated: generateTimestampz(),
		blockReward: convertedBlock.block.blockReward,
	}
	const parseState = stringToHex(JSONStringify(blockState))
	await rocksState.put(`blockState`, parseState, {
		sync: true,
	})
}
