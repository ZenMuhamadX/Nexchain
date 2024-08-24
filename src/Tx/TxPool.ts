import { TxInterface } from '../model/Tx'

export class TxPool {
  public pendingTx: TxInterface[]

  constructor() {
    this.pendingTx = []
  }

  addTx(tx: TxInterface) {
    this.pendingTx.push(tx)
  }

  getPendingTx(): TxInterface[] {
    return this.pendingTx
  }

  clear(): void {
    this.pendingTx = []
  }
}


