import immutable from 'deep-freeze'
// Mengimpor fungsi untuk menghasilkan hash blok
import { TxBlock, TxInterface } from './TxBlock'

// models/Block.ts
// Kelas ini merepresentasikan blok dalam blockchain
export class Block {
  // Indeks blok dalam blockchain
  public index: number
  // Timestamp blok
  public timestamp: string
  // Transaksi yang termasuk dalam blok
  public transactions: TxInterface[] | TxBlock[]
  // Hash dari blok sebelumnya dalam blockchain
  public previousHash: string
  // Hash dari blok ini
  public hash: string
  // Signature
  public signature: string
  // Nonce
  public nonce?: number

  // Konstruktor untuk kelas Block
  constructor(
    index: number,
    timestamp: string,
    transactions: TxInterface[],
    previousHash: string,
    validHash: string,
    signature: string,
    nonce?: number,
  ) {
    this.index = index
    this.timestamp = timestamp
    this.transactions = transactions
    this.previousHash = previousHash
    // Menghasilkan hash blok
    this.hash = validHash
    // Menambahkan tanda tangan (signature)
    this.signature = signature
    // Menambahkan nonce (opsional)
    this.nonce = nonce
  }

  public getBlock() {
    return immutable(this) as Block
  }

  // Mendapatkan transaksi yang termasuk dalam blok
  public getTransactions(): TxInterface[] {
    return immutable(this.transactions) as TxInterface[]
  }
}
