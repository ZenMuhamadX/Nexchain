import { createHmac } from 'crypto'

// Fungsi untuk menandatangani data
export const generateSignature = (data: string, privateKey: string): string => {
  // Membuat HMAC dengan algoritma SHA-256
  const hmac = createHmac('sha256', privateKey)

  // Menambahkan data ke HMAC
  hmac.update(data)

  // Menghasilkan signature dalam format hexadecimal
  const signature = hmac.digest('hex')

  return signature
}
