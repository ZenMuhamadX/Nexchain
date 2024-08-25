// models/TxInterface.ts
import crypto from 'crypto'
export interface TxInterface {
  txHash?: string
  amount: number
  sender: string
  recipient: string
  message?: string
  nonce?: number
}
