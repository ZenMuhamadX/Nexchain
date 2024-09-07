import pino from 'pino'
import * as path from 'path'

// Definisi interface ErrorInfo
interface ErrorInfo {
  error: string | any
  time: string
  hint?: string
  warning?: any
  stack: any
}

// Tentukan path direktori dan file log
const logDirPath = path.join(__dirname, '../../log')
const logFilePath = path.join(logDirPath, 'error_log.log')

// Buat logger Pino dengan transportasi ke file
const logger = pino({ level: 'error' }, pino.destination(logFilePath))

// Fungsi untuk menyimpan log kesalahan menggunakan Pino
export const loggingErr = (err: ErrorInfo): void => {
  if (err) {
    // Format log message
    const logMessage = {
      error: err.error,
      time: err.time,
      hint: err.hint || 'N/A',
      warning: err.warning || 'N/A',
      stack: err.stack || 'N/A',
    }

    try {
      // Menulis log kesalahan ke dalam file
      logger.error(logMessage)

      // Mencetak log kesalahan ke konsol
      console.error('Error details saved to log file.')
      console.error(logMessage)
    } catch (error) {
      // Menangani kesalahan jika proses penyimpanan gagal
      console.error('Error saving error log:', error)
    }
  }
}
