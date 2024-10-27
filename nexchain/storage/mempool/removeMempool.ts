import { rocksMempool } from 'nexchain/rocksdb/memPool'

export const removeMemPool = async (txHash: string) => {
	try {
		await rocksMempool.del(`0x${txHash}`, {
			sync: false,
		})
	} catch (error) {
		console.error('Error removing transaction:', error)
	}
}
