import crypto from 'crypto'
import { TxInterface } from '../model/Tx'
export const createTxHash = (data: TxInterface) => {
  const from = data.sender
  const to = data.recipient
  const amount = data.amount
  const message = data.message
  return crypto
    .createHash('sha256')
    .update(`${from}-${to}-${amount}-${message}`)
    .digest('hex')
}
