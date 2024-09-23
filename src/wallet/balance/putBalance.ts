import { leveldb } from '../../leveldb/init'
import { loggingErr } from 'src/logging/errorLog'
import { structBalance } from 'src/leveldb/struct/structBalance'

export const putBalance = (address: string, balance: structBalance): void => {
	try {
		if (!address || !balance) {
			loggingErr({
				error: 'data not found',
				stack: new Error().stack,
				hint: 'data not found',
				time: new Date().toISOString(),
				warning: null,
				context: 'leveldb',
			})
			return
		}
		leveldb.put(address, JSON.stringify(balance), { sync: true })
	} catch (error) {
		loggingErr({
			error: 'Error putting data',
			time: new Date().toISOString(),
			context: 'leveldb',
			stack: new Error().stack,
			hint: 'An unexpected error occurred while putting data.',
			warning: null,
		})
	}
}
