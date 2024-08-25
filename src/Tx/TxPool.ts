import crypto from 'node:crypto'
import { generateTimestampz } from './../lib/generateTimestampz' // Mengimpor fungsi untuk menghasilkan timestamp
import { TxInterface } from '../model/Tx' // Mengimpor interface untuk objek transaksi
import { pendingBlock } from '../model/PendingBlock' // Mengimpor class untuk blok yang tertunda
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
  private pendingBlocks: pendingBlock[] // Array untuk menyimpan blok yang tertunda

  constructor() {
    this.pendingTx = [] // Inisialisasi array transaksi yang tertunda sebagai array kosong
    this.pendingBlocks = [] // Inisialisasi array blok yang tertunda sebagai array kosong
  }

  addPendingTx(dataTx: rawTx): void {
    // Fungsi untuk menambahkan transaksi ke array transaksi yang tertunda
    let tx: TxInterface = dataTx
    tx.txHash = createTxHash(dataTx)
    this.pendingTx.push(tx)
    if (this.pendingTx.length > 10) {
      // jumlah transaksi yang tertunda melebihi 10)
      this.createPendingBlock() // Membuat blok baru dari transaksi yang tertunda
    }
  }

  createPendingBlock(): void {
    const txForBlock = this.pendingTx.splice(0, 10) // Mengambil dan menghapus 10 transaksi pertama
    const timestampz = generateTimestampz()
    let blockHash = ''
    let nonce = 0

    // Menetapkan nonce untuk setiap transaksi
    txForBlock.forEach((tx) => {
      tx.nonce = nonce // Mulai dengan nonce awal
    })

    // Mencoba berbagai nonce untuk menemukan hash yang valid
    do {
      txForBlock.forEach((tx) => {
        tx.nonce = nonce
      })

      // Membuat hash blok
      const blockData =
        txForBlock.map((tx) => createTxHash(tx)).join('-') + `-${timestampz}`
      blockHash = crypto.createHash('sha256').update(blockData).digest('hex')

      // Increment nonce untuk percobaan berikutnya
      nonce++
    } while (!blockHash.startsWith('0')) // Memeriksa apakah hash dimulai dengan '0'

    // Setelah menemukan nonce yang valid, buat blok baru
    const newBlock = new pendingBlock(txForBlock, timestampz, blockHash)
    this.pendingBlocks.push(newBlock)
  }

  getPendingTx(): TxInterface[] {
    // Fungsi untuk mendapatkan array transaksi yang tertunda
    return immutable(this.pendingTx) as TxInterface[]
  }

  getPendingBlocks(): pendingBlock[] {
    // Fungsi untuk mendapatkan array blok yang tertunda
    return immutable(this.pendingBlocks) as pendingBlock[]
  }
}

const x = new TxPool()
x.addPendingTx({
  amount: 100,
  sender: 'sender1',
  recipient: 'recipient1',
  message: 'test',
})
x.addPendingTx({
  amount: 200,
  sender: 'sender2',
  recipient: 'recipient2',
  message: 'test',
})

console.log(x.getPendingTx())
console.log(x.getPendingBlocks())
