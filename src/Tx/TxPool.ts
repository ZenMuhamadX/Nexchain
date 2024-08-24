import { transaction } from './Tx'

export class TxPool {
  private pendingTx: transaction[]
  constructor() {
    this.pendingTx = []
  }

  addTx(tx: transaction) {
    this.pendingTx.push(tx)
  }

  getPendingTx(): transaction[] {
    return this.pendingTx
  }

  clear(): void {
    this.pendingTx = []
  }
}
