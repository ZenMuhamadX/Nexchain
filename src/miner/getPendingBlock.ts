/** @format */

import { transaction } from '../mempool/memPool'
const block = new transaction

export const getPendingBlock = () => {
	const pendingBlock = block.getPendingBlocks()
	return pendingBlock
}
