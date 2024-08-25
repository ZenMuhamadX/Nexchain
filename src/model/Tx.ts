// models/TxInterface.ts
const crypto = rquire("crypto")
export interface TxInterface {
  id: number
  amount: number
  sender: string
  recipient: string
  message?: string
}

const TxHash = crypto.createHash()