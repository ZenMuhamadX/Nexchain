import { rocksMempool } from 'nexchain/rocksdb/memPool'

export const removeContractMemPool = (txHash: string) => {
	try {
		rocksMempool.del(`Contract-0x${txHash}`, {
			sync: true,
		})
	} catch (error) {
		console.error('Error removing transaction:', error)
	}
}
