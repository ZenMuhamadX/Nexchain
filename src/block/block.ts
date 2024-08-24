import { transaction } from '../Tx/Tx'

export class block {
  public index: number
  public timestamp: string
  public transactions: transaction[]
  public previousHash: string
  public hash: string

  constructor(
    index: number,
    timestamp: string,
    Tx: transaction[],
    previousHash: string = ''
  ) {
    this.index = index
    this.timestamp = timestamp
    this.transactions = Tx
    this.previousHash = previousHash
    this.hash = ''
    return this
  }
}
