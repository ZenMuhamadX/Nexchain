import { contract } from 'interface/structContract'
import { rocksMempool } from 'nexchain/db/memPool'

export const loadContractMempool = async (): Promise<contract[]> => {
	const contract: contract[] = [] // Array untuk menyimpan contract

	for await (const [, value] of rocksMempool.iterator({
		gte: 'Contract-0x',
		lt: 'Contract-0y',
		values: true,
		keys: false,
		limit: 100, // Membatasi jumlah item menjadi 100
	})) {
		const data = JSON.parse(value.toString()) as contract
		contract.push(data)
	}

	return contract
}
