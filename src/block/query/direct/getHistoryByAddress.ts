import { chains } from 'src/block/initBlock'
import { MemPoolInterface } from 'src/model/interface/memPool.inf'

export const getHistoryByAddress = (
	address: string,
): MemPoolInterface[] | null => {
	const blockChains = chains.getChains()
	for (const block of blockChains) {
		const transaction = block.block.transactions.find(
			(tx) => tx.from === address,
		)
		if (transaction) {
			return [transaction]
		}
	}
	return null
}
