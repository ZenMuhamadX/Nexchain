import { Block } from '../model/Block'
import { pendingBlock } from '../model/PendingBlock'

const createValidBlockFromPendingBlock = (pendingBlock: pendingBlock) => {
  const transaction = pendingBlock.getTx()
  console.log(transaction)
}

const x = new pendingBlock(
  [{ amount: 100, sender: 'sender1', recipient: 'recipient1' }],
  '123'
)
createValidBlockFromPendingBlock(x)
