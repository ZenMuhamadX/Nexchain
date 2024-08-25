import { generateTimestampz } from './../lib/generateTimestampz' // Mengimpor fungsi untuk menghasilkan timestamp
import { TxInterface } from '../model/TxBlock' // Mengimpor interface untuk objek transaksi
import { TxBlock } from '../model/TxBlock' // Mengimpor class untuk blok yang tertunda
import immutable from 'deep-freeze'
import { createTxHash } from '../lib/createTxHash'

interface RawTransaction {
  amount: number
  sender: string
  recipient: string
  message?: string
}

export class TransactionPool {
  private pendingTransactions: TxInterface[] // Array untuk menyimpan transaksi yang tertunda
  private pendingBlocks: TxBlock[] // Array untuk menyimpan blok yang tertunda

  constructor() {
    this.pendingTransactions = [] // Inisialisasi array transaksi yang tertunda sebagai array kosong
    this.pendingBlocks = [] // Inisialisasi array blok yang tertunda sebagai array kosong
  }

  addTransactionToPool(transactionData: RawTransaction): void {
    // Fungsi untuk menambahkan transaksi ke array transaksi yang tertunda
    let transaction: TxInterface = transactionData as TxInterface
    transaction.txHash = createTxHash(transaction, 1).hash
    this.pendingTransactions.push(transaction)
    if (this.pendingTransactions.length > 10) {
      // Jumlah transaksi yang tertunda melebihi 10
      this.createBlockFromPendingTransactions() // Membuat blok baru dari transaksi yang tertunda
    }
  }

  private createBlockFromPendingTransactions(): void {
    // Fungsi untuk membuat blok baru dari transaksi yang tertunda
    const transactionsForBlock = this.pendingTransactions.splice(0, 10) // Mengambil dan menghapus 10 transaksi pertama
    const timestamp = generateTimestampz() // Menghasilkan timestamp
    const newBlock = new TxBlock(transactionsForBlock, timestamp) // Membuat blok baru dengan 10 transaksi dan timestamp
    this.pendingBlocks.push(newBlock) // Menambahkan blok baru ke array blok yang tertunda
  }

  getPendingBlocks() {
    // Fungsi untuk mendapatkan array blok yang tertunda
    return immutable(this.pendingBlocks)
  }
}
const x = new TransactionPool()
x.addTransactionToPool({
  amount: 100,
  sender: 'sender',
  recipient: 'recipient',
  message: 'message',
})
x.addTransactionToPool({
  amount: 100,
  sender: 'sender',
  recipient: 'recipient',
  message: 'message',
})
x.addTransactionToPool({
  amount: 100,
  sender: 'sender',
  recipient: 'recipient',
  message: 'message',
})
x.addTransactionToPool({
  amount: 100,
  sender: 'sender',
  recipient: 'recipient',
  message: 'message',
})
x.addTransactionToPool({
  amount: 100,
  sender: 'sender',
  recipient: 'recipient',
  message: 'message',
})
x.addTransactionToPool({
  amount: 100,
  sender: 'sender',
  recipient: 'recipient',
  message: 'message',
})
x.addTransactionToPool({
  amount: 100,
  sender: 'sender',
  recipient: 'recipient',
  message: 'message',
})
x.addTransactionToPool({
  amount: 100,
  sender: 'sender',
  recipient: 'recipient',
  message: 'message',
})
x.addTransactionToPool({
  amount: 100,
  sender: 'sender',
  recipient: 'recipient',
  message: 'message',
})
x.addTransactionToPool({
  amount: 100,
  sender: 'sender',
  recipient: 'recipient',
  message: 'message',
})
x.addTransactionToPool({
  amount: 100,
  sender: 'sender',
  recipient: 'recipient',
  message: 'message',
})
console.log(x.getPendingBlocks())
