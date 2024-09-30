import { chains } from 'src/block/initBlock'
import { MemPoolInterface } from 'src/model/interface/memPool.inf'

export const getHistoryByTxHash = (txHash: string): MemPoolInterface | null => {
	const blockChains = chains.getChains()
	for (const block of blockChains) {
		const transaction = block.block.transactions.find(
			(tx) => tx.txHash === txHash,
		)
		if (transaction) {
			return transaction
		}
	}
	return null
}
