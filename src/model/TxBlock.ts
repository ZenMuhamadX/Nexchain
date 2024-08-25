// Mengimpor antarmuka transaksi
// Mengimpor fungsi untuk membuat objek immutable
import immutable from 'deep-freeze'

export interface TxInterface {
  txHash?: string
  amount: number
  sender: string
  recipient: string
  message?: string
  nonce?: number
}

// Kelas untuk blok yang masih menunggu (pending)
export class TxBlock {
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
    return immutable(this.transaction) as TxInterface[]
  }

}
