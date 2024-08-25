import { generateTimestampz } from './../lib/generateTimestampz' // Mengimpor fungsi untuk menghasilkan timestamp
import { TxInterface } from '../model/Tx' // Mengimpor interface untuk objek transaksi
import { TxBlock } from '../model/PendingBlock' // Mengimpor class untuk blok yang tertunda
import immutable from 'deep-freeze'
import { createTxHash } from '../lib/createTxHash'

interface rawTx {
  amount: number
  sender: string
  recipient: string
  message?: string
}

export class TxPool {
  private pendingTx: TxInterface[] // Array untuk menyimpan transaksi yang tertunda
  private txBlock: TxBlock[] // Array untuk menyimpan blok yang tertunda

  constructor() {
    this.pendingTx = [] // Inisialisasi array transaksi yang tertunda sebagai array kosong
    this.txBlock = [] // Inisialisasi array blok yang tertunda sebagai array kosong
  }

  addPendingTx(dataTx: rawTx): void {
    // Fungsi untuk menambahkan transaksi ke array transaksi yang tertunda
    let tx: TxInterface = dataTx
    tx.txHash = createTxHash(tx, 1).hash
    this.pendingTx.push(tx)
    if (this.pendingTx.length > 10) {
      // jumlah transaksi yang tertunda melebihi 10)
      this.createPendingBlock() // Membuat blok baru dari transaksi yang tertunda
    }
  }

  private createPendingBlock(): void {
    // Fungsi untuk membuat blok baru dari transaksi yang tertunda
    const txForBlock = this.pendingTx.splice(0, 10) // Mengambil dan menghapus 10 transaksi pertama
    const timestampz = generateTimestampz() // Menghasilkan timestamp
    const newBlock = new TxBlock(txForBlock, timestampz) // Membuat blok baru dengan 10 transaksi dan timestamp
    this.txBlock.push(newBlock) // Menambahkan blok baru ke array blok yang tertunda
  }

  getPendingTx(): TxInterface[] {
    // Fungsi untuk mendapatkan array transaksi yang tertunda
    return immutable(this.pendingTx) as TxInterface[]
  }

  getBlockTx(): TxBlock[] {
    // Fungsi untuk mendapatkan array blok yang tertunda
    return immutable(this.txBlock) as TxBlock[]
  }
}

const x = new TxPool()
x.addPendingTx({
  amount: 100,
  sender: 'sender',
  recipient: 'recipient',
  message: 'message',
})
x.addPendingTx({
  amount: 100,
  sender: 'sender',
  recipient: 'recipient',
  message: 'message',
})
x.addPendingTx({
  amount: 100,
  sender: 'sender',
  recipient: 'recipient',
  message: 'message',
})
x.addPendingTx({
  amount: 100,
  sender: 'sender',
  recipient: 'recipient',
  message: 'message',
})
x.addPendingTx({
  amount: 100,
  sender: 'sender',
  recipient: 'recipient',
  message: 'message',
})
x.addPendingTx({
  amount: 100,
  sender: 'sender',
  recipient: 'recipient',
  message: 'message',
})
x.addPendingTx({
  amount: 100,
  sender: 'sender',
  recipient: 'recipient',
  message: 'message',
})
x.addPendingTx({
  amount: 100,
  sender: 'sender',
  recipient: 'recipient',
  message: 'message',
})
x.addPendingTx({
  amount: 100,
  sender: 'sender',
  recipient: 'recipient',
  message: 'message',
})
x.addPendingTx({
  amount: 100,
  sender: 'sender',
  recipient: 'recipient',
  message: 'message',
})
x.addPendingTx({
  amount: 100,
  sender: 'sender',
  recipient: 'recipient',
  message: 'message',
})
console.log(x.getBlockTx())
