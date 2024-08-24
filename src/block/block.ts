import { transactionInterface } from '../Tx/Tx'
import { generateBlockHash } from '../lib/generateHash'

export class block {
  private _hash: string
  private _transactions: transactionInterface[]

  constructor(
    public readonly index: number,
    public readonly timestamp: string,
    transactions: transactionInterface[],
    public readonly previousHash: string
  ) {
    this._transactions = [...transactions]
    this._hash = generateBlockHash(index, timestamp, transactions, previousHash)
  }
  public get hash(): string {
    return this._hash
  }
  public getTransactions(): transactionInterface[] {
    return [...this._transactions]
  }
}
