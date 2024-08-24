// models/TxInterface.ts
export interface TxInterface {
  id: number
  amount: number
  sender: string
  recipient: string
  message?: string
}
