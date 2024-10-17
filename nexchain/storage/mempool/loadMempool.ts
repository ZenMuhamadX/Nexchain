import { leveldbMempool } from 'nexchain/leveldb/memPool'
import { txInterface } from 'nexchain/model/interface/memPool.inf'

export const loadMempool = async (): Promise<txInterface[]> => {
	const loadedPool: txInterface[] = []

	for await (const [key, value] of leveldbMempool.iterator({
		gte: '0x',
		lt: '0y',
		values: true,
		fillCache: true,
		reverse: false,
		keys: true,
		keyEncoding: 'utf-8',
		valueEncoding: 'json',
	})) {
		if (key.length === 69) {
			loadedPool.push(value)
		}
	}
	return loadedPool
}
