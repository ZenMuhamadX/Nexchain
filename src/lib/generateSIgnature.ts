import crypto from 'crypto'
import fs from 'node:fs'

export const generateSignature = (hashBlock: string): string => {
  const hash = crypto.createSign('SHA256')
  hash.update(hashBlock)
  return hash.sign(`${generateKeyPair().privateKey}`, 'hex')
}

export const generateKeyPair = () => {
  if (fs.existsSync('public.pem') && fs.existsSync('private.pem')) {
    const publicKey = fs.readFileSync('public.pem', 'utf8')
    const privateKey = fs.readFileSync('private.pem', 'utf8')
    return { publicKey, privateKey }
  } else {
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
    fs.writeFileSync('public.pem', publicKey)
    fs.writeFileSync('private.pem', privateKey)
    return { publicKey, privateKey }
  }
}
