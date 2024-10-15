import { txInterface } from 'src/model/interface/memPool.inf'
import { getAllBlock } from '../block/getAllBlock'
import _ from 'lodash'

export const getHistoryByAddress = async (
	address: string,
): Promise<txInterface[] | undefined> => {
	const blocks = await getAllBlock()
	const filteredTransactions: any[] = []
	_.forEach(blocks, (block) => {
		const transactions = block.block.transactions

		_.forEach(transactions, (transaction) => {
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
