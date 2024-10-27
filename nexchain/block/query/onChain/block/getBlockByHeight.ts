import { Block } from 'nexchain/model/block/block'
import { getBlockByHash } from './getBlockByHash'
import { HexString } from 'interface/structBlock'
import { rocksState } from 'nexchain/rocksdb/state'

export const getBlockByHeight = async (
	height: number,
	enc: 'json' | 'hex',
): Promise<Block | undefined | HexString> => {
	try {
		const blockHash = await rocksState.get(`blockHeight:${height}`, {
			fillCache: true,
			asBuffer: false,
		})
		if (!blockHash) return undefined
		return await getBlockByHash(blockHash as string, enc)
	} catch (error) {
		return undefined
	}
}
