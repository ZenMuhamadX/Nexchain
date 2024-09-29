import { leveldb } from 'src/leveldb/init'
import { statePoolFile } from './saveMemPool'
import fs from 'fs'
import { MemPoolInterface } from 'src/model/interface/memPool.inf'

// Fungsi utama untuk memuat mempool dari LevelDB dan statePool.json
export const loadMempool = async () => {
	try {
		const mempool: MemPoolInterface[] = []

		// 1. Muat statePool dari file (txHash)
		if (!fs.existsSync(statePoolFile)) {
			console.log('No statePool file found, returning empty mempool.')
			return mempool // Return empty mempool jika tidak ada file
		}

		const statePool: string[] = JSON.parse(
			fs.readFileSync(statePoolFile, 'utf-8'),
		)

		// 2. Iterasi melalui txHash dan ambil data transaksi dari LevelDB
		for (const txHash of statePool) {
			try {
				const transactionData = await leveldb.get(txHash)
				mempool.push(JSON.parse(transactionData))
			} catch (error) {
				console.error(`Error loading transaction for ${txHash}:`, error)
			}
		}
		return mempool // Return mempool yang sudah dimuat
	} catch (error) {
		console.error('Error loading mempool:', error)
		return []
	}
}
