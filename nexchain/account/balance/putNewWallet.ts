import { loggingErr } from 'logging/errorLog'
import { structBalance } from 'nexchain/transaction/struct/structBalance'
import { generateTimestampz } from 'nexchain/lib/timestamp/generateTimestampz'
import { leveldbState } from 'nexchain/leveldb/state'

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
			isContract: false,
			nonce: 0,
			lastTransactionDate: null,
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
