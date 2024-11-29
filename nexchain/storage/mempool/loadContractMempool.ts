import { contract } from 'interface/structContract'
import { rocksMempool } from 'nexchain/db/memPool'

export const loadContractMempool = (): Promise<contract[]> => {
	return new Promise((resolve, reject) => {
		const contract: contract[] = [] // Array untuk menyimpan contract

		const readStream = rocksMempool.createReadStream({
			valueAsBuffer: false,
			gte: 'Contract-0x',
			lt: 'Contract-0y',
			values: true,
			keys: false,
			limit: 100, // Membatasi jumlah item menjadi 100
		})

		readStream.on('data', (data) => {
			contract.push(JSON.parse(data))
		})

		readStream.on('end', () => {
			resolve(contract) // Kembalikan array contract
		})

		readStream.on('error', (err) => {
			reject(err)
		})
	})
}
