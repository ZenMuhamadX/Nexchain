import { generateTimestampz } from 'nexchain/lib/generateTimestampz'
import { Block } from 'nexchain/model/block/block'
import { rocksState } from 'nexchain/db/state'
import { stringToHex } from 'nexchain/hex/stringToHex'

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
