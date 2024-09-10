// Mengimpor fungsi
import immutable from 'deep-freeze'
import { TxBlock, TxInterface } from './TxBlock'

interface walletData {
  address: string
  balance: number
  signature: string
}

// models/Block.ts
// Kelas ini merepresentasikan blok dalam blockchain
export class Block {
  // Indeks blok dalam blockchain
  public index: number
  // Timestamp blok
  public timestamp: string
  // Data yang akan disimpan dalam blok
  public walletData: walletData[]
  // Transaksi yang termasuk dalam blok
  public transactions: TxInterface[] | TxBlock[]
  // Hash dari blok sebelumnya dalam blockchain
  public previousHash: string
  // Hash dari blok ini
  public hash: string
  // Signature
  public signature: string
  // Nonce
  public nonce?: number
  // reward
  private reward: number

  // Konstruktor untuk kelas Block
  constructor(
    index: number,
    timestamp: string,
    transactions: TxInterface[],
    previousHash: string,
    validHash: string,
    signature: string,
    nonce?: number,
  ) {
    this.index = index
    this.timestamp = timestamp
    this.transactions = transactions
    this.previousHash = previousHash
    // Menghasilkan hash blok
    this.hash = validHash

    this.walletData = []
    // Menambahkan tanda tangan (signature)
    this.signature = signature
    // Menambahkan nonce (opsional)
    this.nonce = nonce
    // reward
    this.reward = 50
  }

  public getBlock() {
    return immutable(this) as Block
  }

  // Mendapatkan transaksi yang termasuk dalam blok
  public getTransactions(): TxInterface[] {
    return immutable(this.transactions) as TxInterface[]
  }
  // Mendapatkan dataWallet
  public getWalletData() {
    const rawWallet = this.walletData
    if (!rawWallet.length) {
      return 'no wallet data'
    }
    return rawWallet.reduce(
      (acc, wallet) => {
        return {
          ...acc,
          [wallet.address]: {
            // Menggunakan 'address' sebagai key
            balance: wallet.balance,
            signature: wallet.signature,
          },
        }
      },
      {} as Record<string, { balance: number; signature: string }>,
    )
  }
}
