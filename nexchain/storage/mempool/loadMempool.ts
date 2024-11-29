import { TxInterface } from 'interface/structTx'
import { rocksMempool } from 'nexchain/db/memPool'

export const loadMempool = (): Promise<TxInterface[]> => {
	return new Promise((resolve, reject) => {
		const transactions: TxInterface[] = [] // Array untuk menyimpan transaksi

		const readStream = rocksMempool.createReadStream({
			valueAsBuffer: false,
			gte: '0x',
			lt: '0y',
			values: true,
			keys: false,
			limit: 100, // Membatasi jumlah item menjadi 100
		})

		readStream.on('data', (data) => {
			transactions.push(JSON.parse(data))
		})

		readStream.on('end', () => {
			resolve(transactions) // Kembalikan array transaksi
		})

		readStream.on('error', (err) => {
			reject(err)
		})
	})
}
