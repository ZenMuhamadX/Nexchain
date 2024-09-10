import crypto from 'crypto'
import { TxInterface } from '../../model/TxBlock'

// Membuat hash dari data transaksi dengan nonce yang diberikan.
const createHash = (data: TxInterface, nonce: number): string => {
  const from = data.sender
  const to = data.recipient
  const amount = data.amount
  const message = data.message || ''

  // Membuat hash menggunakan SHA256.
  const hash = crypto
    .createHash('sha256')
    .update(`${from}-${to}-${amount}-${message}-${nonce}`)
    .digest('hex')
  // Mengembalikan hash dengan prefix '0x'.
  return `0x${hash}`
}

// Menemukan nonce yang valid untuk transaksi sehingga hash dimulai dengan sejumlah '0'.
export const createTxHash = (
  data: TxInterface,
  difficulty: number = 1,
): { nonce: number; hash: string } => {
  let nonce = 0
  let hash = ''

  // Melakukan perulangan hingga hash yang valid ditemukan.
  do {
    hash = createHash(data, nonce)
    nonce++
  } while (!hash.startsWith('0x'.repeat(difficulty))) // Memeriksa apakah hash dimulai dengan jumlah '0' yang dibutuhkan.

  // Mengembalikan nonce dan hash.
  return { nonce: nonce - 1, hash }
}
