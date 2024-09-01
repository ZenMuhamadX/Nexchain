import * as fs from 'fs'
import * as path from 'path'

// Nama file log di direktori ../log
const logDirPath = path.join(__dirname, '../..', 'log')
const logFilePath = path.join(logDirPath, 'blocks.log')

// Membuat direktori log jika belum ada
if (!fs.existsSync(logDirPath)) {
  fs.mkdirSync(logDirPath, { recursive: true })
}

// Fungsi untuk menulis log ke file
function logMessage(message: string): void {
  // Format pesan log dengan timestamp
  const timestamp = new Date().toISOString()
  const logEntry = `${timestamp} - ${message}\n`

  // Menulis log ke file
  fs.appendFile(logFilePath, logEntry, (err) => {
    if (err) {
      console.error('Failed to write to log file', err)
    }
  })
}

// Contoh penggunaan
logMessage('Ini adalah pesan log pertama.')
logMessage('Ini adalah pesan log kedua.')

console.log('Log telah ditulis ke file.log')
