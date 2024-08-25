import { TxInterface } from './Tx'
import immutable from 'deep-freeze'
export class pendingBlock {
  private transaction: TxInterface[]
  private timestamp: string
  private hash: string
  constructor(transaction: TxInterface[], timestamp: string, hash: string) {
    this.transaction = transaction
    this.timestamp = immutable(timestamp)
    this.hash = immutable(hash)
  }

  public getTx(): TxInterface[] {
    return this.transaction
  }

  public getTimestamp(): string {
    return this.timestamp
  }
}
