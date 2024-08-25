import crypto from 'crypto'
import { TxInterface } from '../model/Tx'

// Menambahkan nonce ke transaksi
const createHash = (data: TxInterface, nonce: number): string => {
  const from = data.sender
  const to = data.recipient
  const amount = data.amount
  const message = data.message || ''

  // Membuat hash dengan nonce
  const hash = crypto
    .createHash('sha256')
    .update(`${from}-${to}-${amount}-${message}-${nonce}`)
    .digest('hex')
  return `0x${hash}`
}

// Fungsi untuk menemukan nonce yang valid sehingga hash dimulai dengan '0'
export const createTxHash = (
  data: TxInterface,
  difficulty: number = 1
): { nonce: number; hash: string } => {
  let nonce = 0
  let hash = ''

  // Loop sampai hash yang valid ditemukan
  do {
    hash = createHash(data, nonce)
    nonce++
  } while (!hash.startsWith('0x0'.repeat(difficulty))) // Memeriksa apakah hash dimulai dengan karakter '0' sesuai difficulty

  return { nonce: nonce - 1, hash } // Kembalikan nonce terakhir yang valid dan hash
}
