import crypto from 'crypto'
import { getIpNode } from './ip/getIp'

export const generateSignature = (hashBlock: string): string => {
  const hash = crypto.createSign('SHA256')
  hash.update(hashBlock)
  return hash.sign(`${generateKeyPair().privateKey}`, 'hex')
}

export const generateKeyPair = () => {
  const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem',
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem',
    },
  })
  return { publicKey, privateKey }
}
