import { Block } from 'nexchain core/model/block/block'
import { getBlockState } from 'nexchain core/storage/state/getState'
import { getBlockByHash } from './getBlockByHash'
import { HexString } from 'interface/common/hexString'

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
