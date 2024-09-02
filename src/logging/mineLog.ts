import * as fs from 'fs'
import * as path from 'path'

// Definisi interface Status
interface Status {
  mined_at: string
  hash: string
  miner: string
  difficulty: number
  nonce: number
}

// Fungsi untuk menyimpan log mining ke dalam file
export const mineLog = (status: Status) => {
  // Format log sebagai string teks
  const logMessage =
    [
      `Mined At: ${status.mined_at}`,
      `Hash: ${status.hash}`,
      `Miner: ${status.miner}`,
      `Difficulty: ${status.difficulty}`,
      `Nonce: ${status.nonce}`,
      '----------------------------------', // Separator for readability
    ].join('\n') + '\n'

  // Tentukan path direktori dan file log
  const logDirPath = path.join(__dirname, '../../log')
  const logFilePath = path.join(logDirPath, 'mining_log.log')

  try {
    // Membuat direktori jika belum ada
    if (!fs.existsSync(logDirPath)) {
      fs.mkdirSync(logDirPath, { recursive: true })
    }

    // Menulis log ke dalam file
    fs.appendFileSync(logFilePath, logMessage, 'utf8')

    // Juga mencetak log ke konsol untuk konfirmasi (opsional)
    console.info('Mining log saved:', logMessage)
  } catch (error) {
    // Menangani kesalahan jika proses penyimpanan gagal
    console.error('Error saving mining log:', error)
  }
}
