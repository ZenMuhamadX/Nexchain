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
    transactions: TxBlock[],
    previousHash: string
  ) {
    this.index = index
    this.timestamp = timestamp
    this.transactions = transactions
    this.previousHash = previousHash
    // Menghasilkan hash blok
    this.hash = generateBlockHash(index, timestamp, transactions, previousHash)
  }

  // Mendapatkan transaksi yang termasuk dalam blok
  public getTransactions(): TxInterface[] {
    return this.transactions as TxInterface[]
  }
}
const x = new Block(
  0,
  '2024-01-01T00:00:00Z',
  [{ sender: 'sender', receiver: 'receiver', amount: 100 }],
  ''
)
console.log(x.getTransactions())
