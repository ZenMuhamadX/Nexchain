import { leveldbState } from 'nexchain/leveldb/state'
import { generateTimestampz } from 'nexchain/lib/generateTimestampz'
import { loggingErr } from 'logging/errorLog'
import { structBalance } from 'interface/structBalance'

export const getBalance = async (
	address: string,
): Promise<structBalance | undefined> => {
	try {
		if (!address) {
			console.info('address not provided')
			return
		}
		const balance = await leveldbState.get(address, {
			keyEncoding: 'buffer',
			valueEncoding: 'json',
			fillCache: true,
		})
		if (!balance) {
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
		return balance
	} catch (error) {
		if (error instanceof Error) {
			console.error('Error getting data:', error.message)
			return
		}
		loggingErr({
			error: error,
			time: generateTimestampz(),
			context: 'leveldb',
			stack: new Error().stack,
			hint: 'An unexpected error occurred while getting data.',
			warning: null,
		})
		return
	}
}
