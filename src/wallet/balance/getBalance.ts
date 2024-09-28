import { leveldb } from '../../leveldb/init'
import { generateTimestampz } from 'src/lib/timestamp/generateTimestampz'
import { loggingErr } from 'src/logging/errorLog'
import { structBalance } from 'src/leveldb/struct/structBalance'

export const getBalance = async (
	address: string,
): Promise<structBalance | undefined> => {
	try {
		if (!address) {
			console.info('address not provided')
			return
		}
		const balance = await leveldb.get(address, { valueEncoding: 'json' })
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
