import { TxInterface} from './Tx'
import { generateBlockHash } from '../lib/generateHash'

// models/Block.ts
export class Block {
  public index: number
  public timestamp: string
  public transactions: TxInterface[]
  public previousHash: string
  public hash: string

  constructor(
    index: number,
    timestamp: string,
    transactions: any[],
    previousHash: string
  ) {
    this.index = index
    this.timestamp = timestamp
    this.transactions = transactions
    this.previousHash = previousHash
    this.hash = generateBlockHash(index, timestamp, transactions, previousHash)
  }

  public getTransactions(): any[] {
    return this.transactions
  }
}
