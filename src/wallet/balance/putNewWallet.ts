import { leveldb } from '../../leveldb/init'
import { loggingErr } from 'src/logging/errorLog'
import { structBalance } from 'src/leveldb/struct/structBalance'
import { generateTimestampz } from 'src/lib/timestamp/generateTimestampz'

export const putNewWallet = (address: string): void => {
	try {
		if (!address) {
			loggingErr({
				error: 'data address not found',
				stack: new Error().stack,
				hint: 'data not found',
				time: generateTimestampz(),
				warning: null,
				context: 'leveldb',
			})
			return
		}
		const initBalance: structBalance = {
			address: address,
			balance: 0,
			timesTransaction: 0,
		}
		leveldb.put(address, JSON.stringify(initBalance), {
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
