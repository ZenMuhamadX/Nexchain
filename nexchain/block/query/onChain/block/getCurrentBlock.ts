import { Block } from 'nexchain/model/block/block'
import { getBlockState } from 'nexchain/storage/state/getState'
import { HexString } from 'interface/structBlock'
import { getBlockByHash } from './getBlockByHash'

export const getCurrentBlock = async (
	enc: 'json' | 'hex',
): Promise<Block | HexString> => {
	const stateData = await getBlockState()
	if (!stateData) {
		throw new Error('Block state not found')
	}
	const latestBlock = await getBlockByHash(stateData?.currentBlockHash, enc)
	if (!latestBlock) {
		throw new Error('Block not found')
	}
	return latestBlock
}
