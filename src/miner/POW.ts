import * as crypto from 'crypto'
import { BSON } from 'bson'

interface blockData {
  index: number
  timestamp: string
  transactions: any[]
  previousHash: string
  signature: string
}

export const proofOfWork = (
  blockData: blockData,
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
    if (hash.startsWith('0000')) {
      return { nonce, hash }
    }

    nonce++ // Tambah nonce dan coba lagi
  }
}
