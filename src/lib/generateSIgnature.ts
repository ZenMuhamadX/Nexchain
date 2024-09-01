import * as crypto from 'crypto'
import { createKeyPair } from './createKeyPair'

export const generateSignature = (hashBlock: string): string => {
  const hash = crypto.createSign('SHA256')
  hash.update(hashBlock)
  return hash.sign(`${createKeyPair().privateKey}`, 'hex')
}