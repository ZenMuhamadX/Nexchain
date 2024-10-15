import { leveldb } from 'src/leveldb/block'

export const getBlockByHash = async (hash: string) => {
	const block = await leveldb.get(hash, {
		fillCache: true,
		valueEncoding: 'json',
		keyEncoding: 'utf-8',
	})
	return block
}
