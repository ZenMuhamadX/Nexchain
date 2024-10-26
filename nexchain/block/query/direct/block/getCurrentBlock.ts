import { Block } from 'nexchain/model/block/block'
import { getBlockByHeight } from './getBlockByHeight'
import { getBlockState } from 'nexchain/storage/block/getState'
import { HexString } from 'interface/structBlock'

export const getCurrentBlock = async (
	enc: 'json' | 'hex',
): Promise<Block | HexString> => {
	const stateData = await getBlockState()
	if (!stateData) {
		throw new Error('Block state not found')
	}
	const latestBlock = await getBlockByHeight(
		stateData?.currentBlockHeight!,
		enc,
	)
	if (!latestBlock) {
		throw new Error('Block not found')
	}
	return latestBlock
}
