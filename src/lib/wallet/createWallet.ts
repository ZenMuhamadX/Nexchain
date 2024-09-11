import { getKeyPair} from '../hash/getKeyPair'
import { processPubKey } from './processPubKey'
import { addChecksum } from './addChecksum'
import bs58 from 'bs58'
// Memformat alamat dompet
export const createWalletAddress = () => {
  const publicKey = getKeyPair().publicKey

  // Mengatur byte versi ke 0x00
  const version = 0x00

  // Membuat alamat dompet dari kunci publik
  const address = processPubKey(publicKey)

  // Menggabungkan byte versi dan alamat
  const versionAddress = Buffer.concat([Buffer.from([version]), address])

  // Menambahkan checksum ke alamat yang telah diberi versi
  const addressWithCheckSum = addChecksum(versionAddress)

  const addressBase58 = bs58.encode(addressWithCheckSum)

  // Mengembalikan alamat dengan checksum sebagai string hex
  return `NxC${addressBase58}`
}
