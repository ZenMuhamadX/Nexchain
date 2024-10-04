import { Block } from 'src/model/blocks/block'
import { MemPoolInterface } from 'src/model/interface/memPool.inf'
import { loadBlocks } from 'src/storage/loadBlock'

export const getHistoryByAddress = (
	address: string,
): MemPoolInterface[] | null => {
	const blocks = loadBlocks() as Block[]
	const filteredTransactions: any[] = []

	blocks.forEach((block) => {
		const transactions = block.block.transactions

		transactions.forEach((transaction) => {
			if (transaction.from === address || transaction.to === address) {
				filteredTransactions.push({
					...transaction,
					metadata: {
						blockHeight: block.block.height,
						blockHash: block.block.header.hash,
						blockTimestamp: block.block.header.timestamp,
						merkleRoot: block.block.merkleRoot,
					},
				})
			}
		})
	})

	return filteredTransactions
}
