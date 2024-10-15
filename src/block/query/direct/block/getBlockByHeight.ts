import { leveldb } from 'src/leveldb/block'
import { Block } from 'src/model/blocks/block'
import { getBlockByHash } from './getBlockByHash'

export const getBlockByHeight = async (
	height: number,
): Promise<Block | undefined> => {
	const blockHash = await leveldb
		.get(`Height-${height}`, {
			fillCache: true,
			keyEncoding: 'buffer',
			valueEncoding: 'utf-8',
		})
		.catch(() => {
			return undefined
		})
	if (!blockHash) {
		console.info('block not found')
		return undefined
	}
	const data = await getBlockByHash(blockHash)
	return data
}
