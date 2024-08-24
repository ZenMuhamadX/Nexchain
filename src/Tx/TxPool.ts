import { transactionInterface } from './Tx'

export class TxPool {
  
  private pendingTx: transactionInterface[]

  constructor() {
    this.pendingTx = []
  }

  addTx(tx: transactionInterface) {
    this.pendingTx.push(tx)
  }

  getPendingTx(): transactionInterface[] {
    return this.pendingTx
  }

  clear(): void {
    this.pendingTx = []
  }
}
