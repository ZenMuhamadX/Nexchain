import { generateTimestampz } from 'nexchain/lib/generateTimestampz'
import { Block } from 'nexchain/model/block/block'
import { encodeToBytes } from 'nexchain/hex/encodeToBytes'
import { rocksState } from 'nexchain/rocksdb/state'

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
	const parseState = encodeToBytes(JSON.stringify(blockState))
	rocksState.put(`blockState`, parseState, {
		sync: true,
	})
}
