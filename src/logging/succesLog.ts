import pino from 'pino'
import * as path from 'path'

// Definisi interface BlockInfo
interface BlockInfo {
  timestamp?: string
  hash?: string
  previousHash?: string
  index?: number
  signature?: string
  message?: string
  nonce?: number
}

// Tentukan path direktori dan file log
const logDirPath = path.join(__dirname, '../../log')
const logFilePath = path.join(logDirPath, 'blockfile.log')

// Buat logger Pino dengan transportasi ke file
const logger = pino({ level: 'info' }, pino.destination(logFilePath))

// Fungsi untuk menyimpan log menggunakan Pino
export const successLog = (blockInfo: BlockInfo) => {
  // Format log message
  const logMessage = {
    timestamp: blockInfo.timestamp || 'N/A',
    index: blockInfo.index,
    message: blockInfo.message || 'N/A',
    hash: blockInfo.hash || 'N/A',
    previousHash: blockInfo.previousHash || 'N/A',
    nonce: blockInfo.nonce !== undefined ? blockInfo.nonce : 'N/A',
    signature: blockInfo.signature || 'N/A',
  }

  try {
    // Menulis log ke dalam file
    logger.info(logMessage)

    // Juga mencetak log ke konsol untuk konfirmasi (opsional)
    console.info('Log saved:', logMessage)
  } catch (error) {
    // Menangani kesalahan jika proses penyimpanan gagal
    console.error('Error saving log:', error)
  }
}
