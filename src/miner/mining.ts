import { BlockChains } from '../BlockChains'
import { TransactionPool } from '../Tx/TxPool'
import { generateTimestampz } from '../lib/timestamp/generateTimestampz'
import { loggingErr } from '../logging/errorLog'
import { mineLog } from '../logging/mineLog'

const chain = new BlockChains()
const pool = new TransactionPool()

export const miningBlock = () => {
  const pendingBlock = pool.getPendingBlocks()
  try {
    if (!pendingBlock.length) {
      loggingErr({
        error: 'No pending block to mine',
        time: generateTimestampz(),
        warning: null,
        stack: new Error().stack,
      })
      return
    }
    const succesMine = chain.addBlockToChain(pool.getPendingBlocks())
    if (succesMine) {
      mineLog({
        difficulty: 4,
        hash: chain.getLatestBlock()?.hash,
        mined_at: generateTimestampz(),
        nonce: chain.getLatestBlock()?.nonce,
        miner: '',
      })
    }
  } catch (error) {
    loggingErr({
      error: error,
      time: generateTimestampz(),
      stack: new Error().stack,
    })
  }
}
