import * as crypto from 'crypto'
import { BlockChains } from '../BlockChains'
import { Block } from '../model/Block'
import { generateSignature } from '../lib/generateSIgnature'

interface blockData {
  index: number
  timestamp: string
  transactions: any[]
  previousHash: string
  signature: string
}

export const POW = (blockData: blockData): { nonce: number; hash: string } => {
  let nonce = 0

  while (true) {
    // Gabungkan prefix dan nonce
    const data = `${blockData}-${nonce}`

    // Hitung hash SHA-256
    const hash = crypto.createHash('sha256').update(data).digest('hex')

    // Periksa apakah hash dimulai dengan awalan yang diinginkan
    if (hash.startsWith('00000')) {
      return { nonce, hash }
    }

    nonce++ // Tambah nonce dan coba lagi
  }
}
const latestBlock = new BlockChains().getLatestBlock()

const result = POW({
  index: latestBlock!.index + 1,
  timestamp: latestBlock!.timestamp,
  transactions: latestBlock!.getTransactions(),
  previousHash: latestBlock!.hash,
  signature: latestBlock!.signature,
})

const blockNew = new Block(
  latestBlock!.index + 1,
  latestBlock!.timestamp,
  latestBlock!.getTransactions(),
  latestBlock!.hash,
  result.hash,
  generateSignature(result.hash)
)
console.log(blockNew);