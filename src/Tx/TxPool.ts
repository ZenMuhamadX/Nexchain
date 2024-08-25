import { generateTimestampz } from './../lib/generateTimestampz' // Mengimpor fungsi untuk menghasilkan timestamp
import { TxInterface } from '../model/Tx' // Mengimpor interface untuk objek transaksi
import { pendingBlock } from '../model/PendingBlock' // Mengimpor class untuk blok yang tertunda
import immutable from 'deep-freeze'

export class TxPool {
  private pendingTx: TxInterface[] // Array untuk menyimpan transaksi yang tertunda
  private pendingBlocks: pendingBlock[] // Array untuk menyimpan blok yang tertunda

  constructor() {
    this.pendingTx = [] // Inisialisasi array transaksi yang tertunda sebagai array kosong
    this.pendingBlocks = [] // Inisialisasi array blok yang tertunda sebagai array kosong
  }

  addPendingTx(tx: TxInterface): void {
    // Fungsi untuk menambahkan transaksi ke array transaksi yang tertunda
    this.pendingTx.push(tx)
    if (this.pendingTx.length > 10) {
      // jumlah transaksi yang tertunda melebihi 10)
      this.createPendingBlock() // Membuat blok baru dari transaksi yang tertunda
    }
  }

  createPendingBlock(): void {
    // Fungsi untuk membuat blok baru dari transaksi yang tertunda
    const txForBlock = this.pendingTx.splice(0, 10) // Mengambil 10 transaksi pertama dari array transaksi yang tertunda
    const timestampz = generateTimestampz() // Menghasilkan timestamp
    const newBlock = new pendingBlock(txForBlock, timestampz) // Membuat blok baru dengan 10 transaksi dan timestamp
    this.pendingBlocks.push(newBlock) // Menambahkan blok baru ke array blok yang tertunda
    this.pendingTx = this.pendingTx.slice(10) // Menghapus 10 transaksi pertama dari array transaksi yang tertunda (sudah ditambahkan ke blok)
  }

  getPendingTx(): TxInterface[] {
    // Fungsi untuk mendapatkan array transaksi yang tertunda
    return immutable(this.pendingTx) as TxInterface[]
  }

  getPendingBlocks(): pendingBlock[] {
    // Fungsi untuk mendapatkan array blok yang tertunda
    return immutable(this.pendingBlocks) as pendingBlock[]
  }

  clear(): void {
    // Fungsi untuk menghapus semua transaksi yang tertunda
    this.pendingTx = []
  }
}

const x = new TxPool()
x.addPendingTx({
  id: 1,
  amount: 100,
  sender: 'sender1',
  recipient: 'recipient1',
})
x.addPendingTx({
  id: 2,
  amount: 200,
  sender: 'sender2',
  recipient: 'recipient2',
})
x.addPendingTx({
  id: 3,
  amount: 300,
  sender: 'sender3',
  recipient: 'recipient3',
})
x.addPendingTx({
  id: 4,
  amount: 400,
  sender: 'sender4',
  recipient: 'recipient4',
})
x.addPendingTx({
  id: 5,
  amount: 500,
  sender: 'sender5',
  recipient: 'recipient5',
})
x.addPendingTx({
  id: 6,
  amount: 600,
  sender: 'sender6',
  recipient: 'recipient6',
})
x.addPendingTx({
  id: 7,
  amount: 700,
  sender: 'sender7',
  recipient: 'recipient7',
})
x.addPendingTx({
  id: 8,
  amount: 800,
  sender: 'sender8',
  recipient: 'recipient8',
})
x.addPendingTx({
  id: 9,
  amount: 900,
  sender: 'sender9',
  recipient: 'recipient9',
})
x.addPendingTx({
  id: 10,
  amount: 1000,
  sender: 'sender10',
  recipient: 'recipient10',
})
x.addPendingTx({
  id: 11,
  amount: 1100,
  sender: 'sender11',
  recipient: 'recipient11',
})
x.addPendingTx({
  id: 12,
  amount: 1100,
  sender: 'sender11',
  recipient: 'recipient11',
})
x.addPendingTx({
  id: 13,
  amount: 1100,
  sender: 'sender11',
  recipient: 'recipient11',
})
x.addPendingTx({
  id: 14,
  amount: 1100,
  sender: 'sender11',
  recipient: 'recipient11',
})

// console.log(x.getPendingTx())

console.log(x.getPendingBlocks()[0].getTx())
// console.log(x.getPendingBlocks()[0].getTimestamp())

// console.log(x.getPendingBlocks())
