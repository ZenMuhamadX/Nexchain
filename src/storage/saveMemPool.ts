import fs from 'fs'
import path from 'path'
import { leveldb } from 'src/leveldb/init'
import { MemPoolInterface } from 'src/model/interface/memPool.inf'

const dirPath = path.join(__dirname, '../../state')
export const statePoolFile = path.join(dirPath, 'statePool.json')

// Fungsi utama untuk menyimpan transaksi ke LevelDB dan statePool
export const saveMempool = async (transactionData: MemPoolInterface) => {
	if (!transactionData) {
		console.log('no data')
		return
	}
	const txHash = transactionData.txHash!
	try {
		// 1. Simpan transaksi ke LevelDB
		await leveldb.put(txHash, JSON.stringify(transactionData))

		// 2. Simpan txHash ke statePool.json
		let statePool: string[] = []

		if (!fs.existsSync(dirPath)) {
			fs.mkdirSync(dirPath)
		}

		// Cek apakah file statePool.json ada
		if (fs.existsSync(statePoolFile)) {
			const data = fs.readFileSync(statePoolFile, 'utf-8')
			statePool = JSON.parse(data)
		}

		// Cek jika txHash belum ada di statePool
		if (!statePool.includes(txHash)) {
			statePool.push(txHash)
			fs.writeFileSync(statePoolFile, JSON.stringify(statePool, null, 2))
		}

		console.log(`txHash: ${txHash}`)
	} catch (error) {
		console.error('Error saving mempool data:', error)
	}
}
