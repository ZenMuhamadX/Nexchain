import { leveldbState } from 'nexchain/leveldb/state'
import { generateTimestampz } from 'nexchain/lib/timestamp/generateTimestampz'
import { Block } from 'nexchain/model/block/block'

export interface blockState {
	currentBlockHeight: number
	prevBlockHash: string
	currentBlockHash: string
	currentTimestamp: number
	blockReward: number
	lastUpdated: number
	currentBlockSize: number
}

export const setBlockState = (block: Block) => {
	const blockState: blockState = {
		currentBlockSize: block.block.size,
		prevBlockHash: block.block.header.previousBlockHash,
		currentBlockHash: block.block.header.hash,
		currentBlockHeight: block.block.height,
		currentTimestamp: block.block.header.timestamp,
		lastUpdated: generateTimestampz(),
		blockReward: block.block.blockReward,
	}
	leveldbState.put(`blockState`, blockState, {
		sync: true,
	})
}
