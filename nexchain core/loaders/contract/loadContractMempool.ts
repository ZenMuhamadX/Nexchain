import { contract } from 'interface/front/structContract'
import { rocksMempool } from 'nexchain core/db/memPool'
import { JSONParse } from 'nexchain core/lib/JSONParse'
import { stringToBigInt } from 'nexchain core/loaders/lib/stringToBigint'

export const loadContractMempool = async (): Promise<contract[]> => {
	const contracts: contract[] = []

	try {
		const iterator = rocksMempool.iterator({
			gte: 'Contract-0x',
			lt: 'Contract-0y',
		})

		let entry = await iterator.next()
		while (entry && !entry[1]) {
			const [, value] = entry
			contracts.push(JSONParse(value))
			entry = await iterator.next()
		}

		await iterator.close()
		return stringToBigInt(contracts)
	} catch (err) {
		throw err
	}
}
