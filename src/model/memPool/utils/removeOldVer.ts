import fs from 'fs'
import path from 'path'
import { loadConfig } from '../../../lib/utils/loadConfig'
import { loggingErr } from '../../../logging/errorLog'
import { generateTimestampz } from '../../../lib/timestamp/generateTimestampz'

export const removeOldVersions = () => {
	try {
		// Tentukan direktori penyimpanan versi mempool
		const dirPath = path.join(__dirname, '../../../../mempool_versions')

		// Baca semua file yang ada di direktori
		const files = fs.readdirSync(dirPath)

		// Filter file yang mengikuti pola versi mempool
		const versionFiles = files.filter(
			(file) => file.startsWith('mempool_v') && file.endsWith('.bin'),
		)

		// Jika jumlah file lebih dari maxVer, kita mulai pembersihan
		const maxVer = loadConfig()!.memPool.maxVer
		if (versionFiles.length > maxVer) {
			// Urutkan file berdasarkan nomor versi dari terkecil ke terbesar
			const sortedFiles = versionFiles.sort((a, b) => {
				const versionA = parseInt(a.match(/mempool_v(\d+)\.bin/)![1], 10)
				const versionB = parseInt(b.match(/mempool_v(\d+)\.bin/)![1], 10)
				return versionA - versionB
			})

			// Hitung berapa file yang harus dihapus
			const filesToDelete = sortedFiles.slice(0, versionFiles.length - maxVer)

			// Hapus file versi terlama
			for (const file of filesToDelete) {
				const filePath = path.join(dirPath, file)
				fs.unlinkSync(filePath)
			}
		}
	} catch (error) {
		loggingErr({
			context: 'removeOldVersions',
			hint: 'Error removing old versions',
			warning: null,
			error: error instanceof Error ? error.message : 'Unknown error',
			stack: error instanceof Error ? error.stack : new Error().stack,
			time: generateTimestampz(),
		})
	}
}
