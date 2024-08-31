import immutable from 'deep-freeze'
// Mengimpor fungsi untuk menghasilkan hash blok
import { generateBlockHash } from '../lib/generateHash'
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

  // Konstruktor untuk kelas Block
  constructor(
    index: number,
    timestamp: string,
    transactions: TxInterface[],
    previousHash: string
  ) {
    this.index = index
    this.timestamp = timestamp
    this.transactions = transactions
    this.previousHash = previousHash
    // Menghasilkan hash blok
    this.hash = generateBlockHash(index, timestamp, transactions, previousHash)
  }

  public getBlock() {
    return immutable(this) as Block
  }

  // Mendapatkan transaksi yang termasuk dalam blok
  public getTransactions(): TxInterface[] {
    return immutable(this.transactions) as TxInterface[]
  }
}
