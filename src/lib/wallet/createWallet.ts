import { createKeyPair } from '../hash/createKeyPair'
import { processPubKey } from './processPubKey'
import { addChecksum } from './addChecksum'

// Memformat alamat dompet
export const createWalletAddress = () => {
  const keyPair = createKeyPair()
  const publicKey = keyPair.publicKey

  // Mengatur byte versi ke 0x00
  const version = 0x0
  // Membuat alamat dompet dari kunci publik
  const address = processPubKey(publicKey)

  // Menggabungkan byte versi dan alamat
  const versionAddress = Buffer.concat([Buffer.from([version]), address])
  // Menambahkan checksum ke alamat yang telah diberi versi
  const addressWithCheckSum = addChecksum(versionAddress)
  // Mengembalikan alamat dengan checksum sebagai string hex
  return addressWithCheckSum.toString('hex')
}
