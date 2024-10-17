import { Block } from 'nexchain/model/blocks/block'
import { getBlockByHash } from './getBlockByHash'
import { leveldbState } from 'nexchain/leveldb/state'

export const getBlockByHeight = async (
	height: number,
): Promise<Block | undefined> => {
	try {
		const blockHash = await leveldbState.get(`blockHeight:${height}`, {
			fillCache: true,
			keyEncoding: 'utf-8',
			valueEncoding: 'utf-8',
		})
		if (!blockHash) return undefined
		const data = await getBlockByHash(blockHash)
		return data
	} catch (error) {
		return undefined
	}
}
