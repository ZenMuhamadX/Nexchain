import { Block } from 'nexchain/model/block/block'
import { getBlockByHash } from './getBlockByHash'
import { leveldbState } from 'nexchain/leveldb/state'
import { HexString } from 'interface/structBlock'

export const getBlockByHeight = async (
	height: number,
	enc: 'json' | 'hex',
): Promise<Block | undefined | HexString> => {
	try {
		const blockHash = await leveldbState.get(`blockHeight:${height}`, {
			fillCache: true,
		})
		if (!blockHash) return undefined
		return await getBlockByHash(blockHash, enc)
	} catch (error) {
		return undefined
	}
}
