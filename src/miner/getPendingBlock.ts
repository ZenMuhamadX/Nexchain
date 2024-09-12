/** @format */

import { TransactionPool } from '../Tx/memPool'
const block = new TransactionPool()

export const getPendingBlock = () => {
	const pendingBlock = block.getPendingBlocks()
	return pendingBlock
}
