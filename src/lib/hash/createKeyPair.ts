import * as fs from 'fs'
import * as crypto from 'crypto'
import * as path from 'path'

// Fungsi untuk menghasilkan pasangan kunci atau membacanya dari file
export const createKeyPair = () => {
  // Tentukan path file kunci
  const publicKeyPath = path.join(__dirname, '../../../key/public.pem')
  const privateKeyPath = path.join(__dirname, '../../../key/private.pem')

  // Cek apakah file kunci sudah ada
  if (fs.existsSync(publicKeyPath) && fs.existsSync(privateKeyPath)) {
    // Membaca kunci dari file
    const publicKey = fs.readFileSync(publicKeyPath, 'utf8')
    const privateKey = fs.readFileSync(privateKeyPath, 'utf8')
    return { publicKey, privateKey }
  } else {
    // Menghasilkan pasangan kunci baru
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

    // Pastikan direktori target ada
    const keyDir = path.dirname(publicKeyPath)
    if (!fs.existsSync(keyDir)) {
      fs.mkdirSync(keyDir, { recursive: true })
    }

    // Menyimpan kunci ke file
    fs.writeFileSync(publicKeyPath, publicKey)
    fs.writeFileSync(privateKeyPath, privateKey)
    return { publicKey, privateKey }
  }
}