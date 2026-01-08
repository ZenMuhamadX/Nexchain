import { TxInterface } from 'interface/structTx'
import { rocksMempool } from 'nexchain/db/memPool'

export const loadMempool = async (): Promise<TxInterface[]> => {
	const transactions: TxInterface[] = [] // Array untuk menyimpan transaksi
	for await (const [, value] of rocksMempool.iterator({
		gte: 'Tx-0x',
		lt: 'Tx-0y',
		values: true,
		keys: false,
		limit: 100, // Membatasi jumlah item menjadi 100
	})) {
		const data = JSON.parse(value.toString()) as TxInterface
		transactions.push(data)
	}
	return transactions
}
