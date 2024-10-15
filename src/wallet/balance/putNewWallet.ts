import { loggingErr } from 'src/logging/errorLog'
import { structBalance } from 'src/transaction/struct/structBalance'
import { generateTimestampz } from 'src/lib/timestamp/generateTimestampz'
import { leveldbState } from 'src/leveldb/state'

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
		leveldbState.put(address, JSON.stringify(initBalance), {
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
