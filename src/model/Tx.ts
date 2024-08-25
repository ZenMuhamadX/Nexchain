// models/TxInterface.ts
export interface TxInterface {
  txHash?: string
  amount: number
  sender: string
  recipient: string
  message?: string
  nonce?: number
}
