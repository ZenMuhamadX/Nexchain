import { generateTimestampz } from './../lib/generateTimestampz' // Mengimpor fungsi untuk menghasilkan timestamp
import { TxInterface } from '../model/Tx' // Mengimpor interface untuk objek transaksi
import { pendingBlock } from '../model/PendingBlock' // Mengimpor class untuk blok yang tertunda

export class TxPool {
  public pendingTx: TxInterface[] // Array untuk menyimpan transaksi yang tertunda
  public pendingBlocks: pendingBlock[] // Array untuk menyimpan blok yang tertunda

  constructor() {
    this.pendingTx = [] // Inisialisasi array transaksi yang tertunda sebagai array kosong
    this.pendingBlocks = [] // Inisialisasi array blok yang tertunda sebagai array kosong
  }

  addPendingTx(tx: TxInterface) {
    // Fungsi untuk menambahkan transaksi ke array transaksi yang tertunda
    this.pendingTx.push(tx)
    if (this.pendingTx.length > 10) {
      // (Blok kode ini kosong, mungkin dimaksudkan untuk menangani kondisi ketika
      // jumlah transaksi yang tertunda melebihi 10)
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
    return this.pendingTx
  }

  clear(): void {
    // Fungsi untuk menghapus semua transaksi yang tertunda
    this.pendingTx = []
  }
}
