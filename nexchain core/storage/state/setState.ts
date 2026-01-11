import { generateTimestampz } from 'nexchain core/lib/generateTimestampz'
import { Block } from 'nexchain core/model/block/block'
import { rocksState } from 'nexchain core/db/state'
import { stringToHex } from 'nexchain core/hex/stringToHex'

export interface blockState {
	currentBlockHeight: number
	prevBlockHash: string
	currentBlockHash: string
	currentTimestamp: number
	blockReward: number
	lastUpdated: number
	currentBlockSize: number
}

export const setBlockState = async (block: Block) => {
	const blockState: blockState = {
		currentBlockSize: block.block.size,
		prevBlockHash: block.block.header.previousBlockHash,
		currentBlockHash: block.block.header.hash,
		currentBlockHeight: block.block.height,
		currentTimestamp: block.block.header.timestamp,
		lastUpdated: generateTimestampz(),
		blockReward: block.block.blockReward,
	}
	const parseState = stringToHex(JSON.stringify(blockState))
	await rocksState.put(`blockState`, parseState, {
		sync: true,
	})
}
