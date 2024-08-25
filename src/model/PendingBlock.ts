// Mengimpor antarmuka transaksi
import { TxInterface } from './Tx'
// Mengimpor fungsi untuk membuat objek immutable
import immutable from 'deep-freeze'

// Kelas untuk blok yang masih menunggu (pending)
export class pendingBlock {
  // Daftar transaksi dalam blok
  private transaction: TxInterface[]
  // Timestamp blok
  private timestamp: string

  // Konstruktor untuk kelas pendingBlock
  constructor(transaction: TxInterface[], timestamp: string) {
    this.transaction = immutable(transaction) as TxInterface[]
    // Membuat timestamp immutable agar tidak bisa diubah
    this.timestamp = immutable(timestamp)
  }

  // Mendapatkan daftar transaksi dalam blok
  public getTx(): TxInterface[] {
    return this.transaction
  }

}
