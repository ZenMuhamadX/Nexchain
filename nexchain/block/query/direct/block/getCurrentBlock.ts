import { Block } from 'nexchain/model/blocks/block'
import { getBlockByHeight } from './getBlockByHeight'
import { getBlockState } from 'nexchain/storage/block/getState'

export const getCurrentBlock = async (): Promise<Block> => {
	const stateData = await getBlockState()
	if (!stateData) {
		throw new Error('Block state not found')
	}
	const latestBlock = await getBlockByHeight(stateData?.currentBlockHeight!)
	if (!latestBlock) {
		throw new Error('Block not found')
	}
	return latestBlock
}
