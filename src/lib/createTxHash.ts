import crypto from 'crypto'
import { TxInterface } from '../model/Tx'

// Menambahkan nonce ke transaksi
export const createTxHash = (data: TxInterface, nonce: number): string => {
  const from = data.sender
  const to = data.recipient
  const amount = data.amount
  const message = data.message || ''

  // Membuat hash dengan nonce
  return crypto
    .createHash('sha256')
    .update(`${from}-${to}-${amount}-${message}-${nonce}`)
    .digest('hex')
}

// Fungsi untuk menemukan nonce yang valid sehingga hash dimulai dengan '0'
export const findValidNonce = (
  data: TxInterface,
  difficulty: number = 1
): { nonce: number; hash: string } => {
  let nonce = 0
  let hash = ''

  // Loop sampai hash yang valid ditemukan
  do {
    hash = createTxHash(data, nonce)
    nonce++
  } while (!hash.startsWith('0'.repeat(difficulty))) // Memeriksa apakah hash dimulai dengan karakter '0' sesuai difficulty

  return { nonce: nonce - 1, hash } // Kembalikan nonce terakhir yang valid dan hash
}
