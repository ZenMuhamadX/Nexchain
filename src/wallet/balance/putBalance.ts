import { loggingErr } from 'src/logging/errorLog'
import { structBalance } from 'src/transaction/struct/structBalance'
import { generateTimestampz } from 'src/lib/timestamp/generateTimestampz'
import { leveldbState } from 'src/leveldb/state'

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
		leveldbState.put(address, balance, {
			sync: true,
			keyEncoding: 'buffer',
			valueEncoding: 'json',
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
