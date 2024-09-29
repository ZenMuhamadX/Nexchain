import { leveldb } from 'src/leveldb/init'
import fs from 'fs'
import path from 'path'

const dirPath = path.join(__dirname, '../../state')
const statePoolFile = path.join(dirPath, 'statePool.json')

export const removeMemPool = async (txHash: string) => {
	try {
		// 1. Hapus transaksi dari LevelDB
		await leveldb.del(txHash)
		console.log(`Transaction ${txHash} deleted from LevelDB.`)

		// 2. Hapus txHash dari statePool.json
		if (fs.existsSync(statePoolFile)) {
			let statePool: string[] = JSON.parse(
				fs.readFileSync(statePoolFile, 'utf-8'),
			)

			// Cari dan hapus txHash dari array
			statePool = statePool.filter((hash) => hash !== txHash)

			// Tulis kembali statePool.json tanpa txHash yang sudah dihapus
			fs.writeFileSync(statePoolFile, JSON.stringify(statePool, null, 2))
			console.log(`Transaction ${txHash} removed from statePool.json.`)
		} else {
			console.log('statePool.json not found, nothing to remove.')
		}
	} catch (error) {
		console.error('Error removing transaction:', error)
	}
}
