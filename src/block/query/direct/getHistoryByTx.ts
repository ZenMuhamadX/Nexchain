import { Block } from 'src/model/blocks/block'
import { MemPoolInterface } from 'src/model/interface/memPool.inf'
import { loadBlocks } from 'src/storage/loadBlock'

export const getHistoryByTxHash = (txHash: string): MemPoolInterface | null => {
	const blockChains = loadBlocks() as Block[]
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
