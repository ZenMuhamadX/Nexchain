import crypto from 'node:crypto'
import { TxInterface } from '../model/Tx'

export const generateBlockHash = (
  index: number,
  timestamp: string,
  Tx: TxInterface[],
  previousHash: string
) => {
  const hash = crypto.createHash('sha256')
  hash.update(`${index}${timestamp}${Tx}${previousHash}`)
  return hash.digest('hex')
}
