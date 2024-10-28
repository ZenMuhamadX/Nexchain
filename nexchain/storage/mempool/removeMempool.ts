import { rocksMempool } from 'nexchain/rocksdb/memPool'

export const removeMemPool = (txHash: string) => {
	try {
		rocksMempool.del(`0x${txHash}`, {
			sync: true,
		})
	} catch (error) {
		console.error('Error removing transaction:', error)
	}
}
