import { TxInterface } from './Tx'
import immutable from 'deep-freeze'
export class pendingBlock {
  private transaction: TxInterface[]
  private timestamp: string
  constructor(transaction: TxInterface[], timestamp: string) {
    this.transaction = transaction
    this.timestamp = immutable(timestamp)
  }

  public getTx(): TxInterface[] {
    return this.transaction
  }

  public getTimestamp(): string {
    return this.timestamp
  }
}
