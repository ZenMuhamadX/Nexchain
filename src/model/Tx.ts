// models/TxInterface.ts
import crypto from "crypto"
export interface TxInterface {
  id: number
  amount: number
  sender: string
  recipient: string
  message?: string
}
