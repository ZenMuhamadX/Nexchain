import { Block } from 'nexchain/model/block/block'
import { getBlockByHash } from './getBlockByHash'
import { HexString } from 'interface/structBlock'
import { rocksState } from 'nexchain/db/state'

export const getBlockByHeight = async (
	height: number,
	enc: 'json' | 'hex',
): Promise<Block | undefined | HexString> => {
	try {
		const blockHash = await rocksState.get(`blockHeight:${height}`, {
			fillCache: true,
		})
		if (!blockHash) return undefined
		return await getBlockByHash(blockHash as string, enc)
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
	} catch (error) {
		return undefined
	}
}
