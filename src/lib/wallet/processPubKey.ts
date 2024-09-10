import crypto from 'crypto'

// Membuat alamat dompet dari kunci publik
export const processPubKey = (publicKey: string) => {
  // Membuat hash SHA256 dari kunci publik
  const sha256Hash = crypto
    .createHash('sha256')
    .update(Buffer.from(publicKey, 'hex'))
    .digest()
  // Membuat hash RIPEMD160 dari hash SHA256
  const ripemd160Hash = crypto
    .createHash('ripemd160')
    .update(sha256Hash)
    .digest()
  // Mengembalikan hash RIPEMD160 sebagai alamat dompet
  return ripemd160Hash
}
