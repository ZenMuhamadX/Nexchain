import { leveldb } from 'src/leveldb/block'
import { Block } from 'src/model/blocks/block'

export const getAllBlock = async (): Promise<Block[]> => {
	const results: Block[] = []

	// Gunakan iterator untuk memindai semua key-value
	for await (const [key, value] of leveldb.iterator({
		gte: '000',
		values: true,
		fillCache: true,
		reverse: false,
		keys: true,
		keyEncoding: 'utf-8',
		valueEncoding: 'buffer',
	})) {
		if (key.length === 64) {
			const block = JSON.parse(value.toString()) as Block
			results.push(block)
		}
	}
	results.sort((a, b) => a.block.height - b.block.height)
	return results
}
