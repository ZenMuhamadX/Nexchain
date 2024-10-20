import { leveldbMempool } from 'nexchain/leveldb/memPool'
import { TxInterface } from 'interface/Nexcoin.inf'

export const loadMempool = async (): Promise<TxInterface[]> => {
	const loadedPool: TxInterface[] = []

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
