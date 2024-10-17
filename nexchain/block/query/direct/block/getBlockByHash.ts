import { leveldb } from 'nexchain/leveldb/block'

export const getBlockByHash = async (hash: string) => {
	const block = await leveldb.get(`blockHash:${hash}`, {
		fillCache: true,
		valueEncoding: 'json',
		keyEncoding: 'utf-8',
	})
	return block
}
