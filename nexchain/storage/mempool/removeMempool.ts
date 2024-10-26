import { leveldbMempool } from 'nexchain/leveldb/memPool'

export const removeMemPool = async (txHash: string) => {
	try {
		await leveldbMempool.del(`0x${txHash}`, {
			sync: false,
		})
	} catch (error) {
		console.error('Error removing transaction:', error)
	}
}
