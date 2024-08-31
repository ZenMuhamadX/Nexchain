import { TransactionPool } from '../Tx/TxPool'
const block = new TransactionPool()

const getPendingBlock = () => {
  const pendingBlock = block.getPendingBlocks()
  return pendingBlock
}