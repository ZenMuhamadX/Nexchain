import { TransactionPool } from '../Tx/TxPool'
const block = new TransactionPool()

export const getPendingBlock = () => {
  const pendingBlock = block.getPendingBlocks()
  return pendingBlock
}
block.addTransactionToPool({
  amount: 1,
  recipient: '0x',
  sender: '0x',
  timestamp: '0',
})
block.addTransactionToPool({
  amount: 1,
  recipient: '0x',
  sender: '0x',
  timestamp: '0',
})
block.addTransactionToPool({
  amount: 1,
  recipient: '0x',
  sender: '0x',
  timestamp: '0',
})
block.addTransactionToPool({
  amount: 1,
  recipient: '0x',
  sender: '0x',
  timestamp: '0',
})
block.addTransactionToPool({
  amount: 1,
  recipient: '0x',
  sender: '0x',
  timestamp: '0',
})
block.addTransactionToPool({
  amount: 1,
  recipient: '0x',
  sender: '0x',
  timestamp: '0',
})
block.addTransactionToPool({
  amount: 1,
  recipient: '0x',
  sender: '0x',
  timestamp: '0',
})
block.addTransactionToPool({
  amount: 1,
  recipient: '0x',
  sender: '0x',
  timestamp: '0',
})
block.addTransactionToPool({
  amount: 1,
  recipient: '0x',
  sender: '0x',
  timestamp: '0',
})
block.addTransactionToPool({
  amount: 1,
  recipient: '0x',
  sender: '0x',
  timestamp: '0',
})
block.addTransactionToPool({
  amount: 1,
  recipient: '0x',
  sender: '0x',
  timestamp: '0',
})
console.log(getPendingBlock())
