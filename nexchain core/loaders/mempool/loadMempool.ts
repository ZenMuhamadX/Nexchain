import { TxInterfaceCore } from 'interface/core/TxInterfaceCore'
import { rocksMempool } from 'nexchain core/db/memPool'
import { JSONParse } from 'nexchain core/lib/JSONParse'
import { stringToBigInt } from 'nexchain core/loaders/lib/stringToBigint'

export const loadMempool = (): Promise<TxInterfaceCore[]> => {
	return new Promise(async (resolve, reject) => {
		try {
			const transactions: TxInterfaceCore[] = []

			for await (const [, value] of rocksMempool.iterator({
				gte: '0x',
				lt: '0y',
				limit: 100,
			})) {
				transactions.push(JSONParse(value as string))
			}

			resolve(stringToBigInt(transactions))
		} catch (err: any) {
			reject(err)
		}
	})
}
