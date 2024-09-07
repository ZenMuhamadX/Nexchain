import pino from 'pino'
import * as path from 'path'

// Definisi interface Status
interface Status {
  mined_at: string
  hash: string | any
  miner: string
  difficulty: number
  nonce: number | any
}

// Tentukan path direktori dan file log
const logDirPath = path.join(__dirname, '../../log')
const logFilePath = path.join(logDirPath, 'mining_log.log')

// Buat logger Pino dengan transportasi ke file
const logger = pino({ level: 'info' },pino.destination(logFilePath))

// Fungsi untuk menyimpan log mining menggunakan Pino
export const mineLog = (status: Status) => {
  // Format log message
  const logMessage = {
    mined_at: status.mined_at,
    hash: status.hash,
    miner: status.miner,
    difficulty: status.difficulty,
    nonce: status.nonce,
  }

  try {
    // Menulis log ke dalam file
    logger.info(logMessage)

    // Juga mencetak log ke konsol untuk konfirmasi (opsional)
    console.info('Mining log saved:', logMessage)
  } catch (error) {
    // Menangani kesalahan jika proses penyimpanan gagal
    console.error('Error saving mining log:', error)
  }
}
