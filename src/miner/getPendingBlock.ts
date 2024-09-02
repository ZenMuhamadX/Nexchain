import { TransactionPool } from '../Tx/TxPool'
const block = new TransactionPool()

export const getPendingBlock = () => {
  const pendingBlock = block.getPendingBlocks()
  return pendingBlock
}