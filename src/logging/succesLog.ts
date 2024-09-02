import * as fs from 'fs'
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

// Fungsi untuk menyimpan log ke dalam file
export const successLog = (blockInfo: BlockInfo) => {
  // Format log sebagai string teks
  const saveLogMessage =
    [
      `Timestamp: ${blockInfo.timestamp || 'N/A'}`,
      `index: ${blockInfo.index || 'N/A'}`,
      `Message: ${blockInfo.message || 'N/A'}`,
      `Hash: ${blockInfo.hash || 'N/A'}`,
      `previousHash: ${blockInfo.previousHash || 'N/A'}`,
      `Nonce: ${blockInfo.nonce !== undefined ? blockInfo.nonce : 'N/A'}`,
      `signature: ${blockInfo.signature || 'N/A'}`,
      '----------------------------------', // Separator for readability
    ].join('\n') + '\n'

  // Format log untuk mencetak ke konsol
  const logMessage =
    [
      `Timestamp: ${blockInfo.timestamp || 'N/A'}`,
      `Hash: ${blockInfo.hash || 'N/A'}`,
      `Message: ${blockInfo.message || 'N/A'}`,
      `Nonce: ${blockInfo.nonce !== undefined ? blockInfo.nonce : 'N/A'}`,
      '----------------------------------', // Separator for readability
    ].join('\n') + '\n'

  // Tentukan path direktori dan file log
  const logDirPath = path.join(__dirname, '../../log')
  const logFilePath = path.join(logDirPath, 'blockfile.log')

  try {
    // Membuat direktori jika belum ada
    if (!fs.existsSync(logDirPath)) {
      fs.mkdirSync(logDirPath, { recursive: true })
    }

    // Menulis log ke dalam file
    fs.appendFileSync(logFilePath, saveLogMessage, 'utf8')

    // Juga mencetak log ke konsol untuk konfirmasi (opsional)
    console.info('Log saved:', logMessage)
  } catch (error) {
    // Menangani kesalahan jika proses penyimpanan gagal
    console.error('Error saving log:', error)
  }
}
