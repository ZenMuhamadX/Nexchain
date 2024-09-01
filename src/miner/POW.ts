import * as crypto from 'crypto'
import { BlockChains } from '../BlockChains'
import { TransactionPool } from '../Tx/TxPool'
import { generateTimestampz } from '../lib/timestamp/generateTimestampz'
import { BSON } from 'bson'

interface blockData {
  index: number
  timestamp: string
  transactions: any[]
  previousHash: string
  signature: string
}

export const proofOfWork = (
  blockData: blockData
): { nonce: number; hash: string } => {
  let nonce = 0

  while (true) {
    // Gabungkan prefix dan nonce ke dalam objek
    const combinedData = {
      nonce,
      index: blockData.index,
      timestamp: blockData.timestamp,
      transactions: blockData.transactions,
      previousHash: blockData.previousHash,
      signature: blockData.signature,
    }

    // Ubah objek menjadi BSON Buffer
    const dataBuffer = BSON.serialize(combinedData)

    // Hitung hash SHA-256
    const hash = crypto.createHash('sha256').update(dataBuffer).digest('hex')

    // Periksa apakah hash dimulai dengan awalan yang diinginkan
    if (hash.startsWith('000')) {
      return { nonce, hash }
    }

    nonce++ // Tambah nonce dan coba lagi
  }
}

const block = new BlockChains()
const latestBlock = block.getLatestBlock()
const txPool = new TransactionPool()

txPool.addTransactionToPool({
  sender: '0x',
  amount: 12,
  recipient: '0x1',
  timestamp: generateTimestampz(),
  message: 'first',
})
txPool.addTransactionToPool({
  sender: '0x',
  amount: 12,
  recipient: '0x1',
  timestamp: generateTimestampz(),
  message: 'first',
})
txPool.addTransactionToPool({
  sender: '0x',
  amount: 12,
  recipient: '0x1',
  timestamp: generateTimestampz(),
  message: 'first',
})
txPool.addTransactionToPool({
  sender: '0x',
  amount: 12,
  recipient: '0x1',
  timestamp: generateTimestampz(),
  message: 'first',
})
txPool.addTransactionToPool({
  sender: '0x',
  amount: 12,
  recipient: '0x1',
  timestamp: generateTimestampz(),
  message: 'first',
})
txPool.addTransactionToPool({
  sender: '0x',
  amount: 12,
  recipient: '0x1',
  timestamp: generateTimestampz(),
  message: 'first',
})
txPool.addTransactionToPool({
  sender: '0x',
  amount: 12,
  recipient: '0x1',
  timestamp: generateTimestampz(),
  message: 'first',
})
txPool.addTransactionToPool({
  sender: '0x',
  amount: 12,
  recipient: '0x1',
  timestamp: generateTimestampz(),
  message: 'first',
})
txPool.addTransactionToPool({
  sender: '0x',
  amount: 12,
  recipient: '0x1',
  timestamp: generateTimestampz(),
  message: 'first',
})
txPool.addTransactionToPool({
  sender: '0x',
  amount: 10000,
  recipient: '0x1',
  timestamp: generateTimestampz(),
  message: 'first',
})
txPool.addTransactionToPool({
  sender: '0x',
  amount: 12,
  recipient: '0x1',
  timestamp: generateTimestampz(),
  message: 'first',
})

block.addBlockToChain(txPool)
console.log(block.getChains())
