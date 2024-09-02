import * as fs from 'fs'
import * as path from 'path'

// Definisi interface ErrorInfo
interface ErrorInfo {
  error: string | any
  time: string
  hint?: string
  warning?: any
}

// Fungsi untuk menyimpan log kesalahan ke dalam file
export const loggingErr = (err: ErrorInfo): void => {
  if (err) {
    // Format log sebagai string teks
    const logMessage =
      [
        `Error: ${err.error}`,
        `Time: ${err.time}`,
        `Hint: ${err.hint || 'N/A'}`,
        `Warning: ${err.warning || 'N/A'}`,
        '----------------------------------', // Separator for readability
      ].join('\n') + '\n'

    // Tentukan path direktori dan file log
    const logDirPath = path.join(__dirname, '../../log')
    const logFilePath = path.join(logDirPath, 'error_log.log')

    try {
      // Membuat direktori jika belum ada
      if (!fs.existsSync(logDirPath)) {
        fs.mkdirSync(logDirPath, { recursive: true })
      }

      // Menulis log kesalahan ke dalam file
      fs.appendFileSync(logFilePath, logMessage, 'utf8')

      // Mencetak log kesalahan ke konsol
      console.error('Error details saved to log file.')
      console.error(logMessage)

      // Menyertakan stack trace dari error yang ditangkap
      console.error('Stack trace:', new Error().stack)
    } catch (error) {
      // Menangani kesalahan jika proses penyimpanan gagal
      console.error('Error saving error log:', error)
    }
  }
}