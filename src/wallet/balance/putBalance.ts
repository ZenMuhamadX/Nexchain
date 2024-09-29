import { leveldb } from '../../leveldb/init'
import { loggingErr } from 'src/logging/errorLog'
import { structBalance } from 'src/leveldb/struct/structBalance'
import { generateTimestampz } from 'src/lib/timestamp/generateTimestampz'

export const putBalance = (address: string, balance: structBalance): void => {
	try {
		if (!address || !balance) {
			loggingErr({
				error: 'data not found',
				stack: new Error().stack,
				hint: 'data not found',
				time: generateTimestampz(),
				warning: null,
				context: 'leveldb',
			})
			return
		}
		if (balance.timesTransaction === undefined) {
			balance.timesTransaction = 0
		}
		leveldb.put(address, JSON.stringify(balance), {
			sync: true,
			valueEncoding: 'buffer',
		})
	} catch (error) {
		loggingErr({
			error: 'Error putting data',
			time: generateTimestampz(),
			context: 'leveldb',
			stack: new Error().stack,
			hint: 'An unexpected error occurred while putting data.',
			warning: null,
		})
	}
}
