import { generateTimestampz } from 'nexchain/lib/generateTimestampz'
import { loggingErr } from 'logging/errorLog'
import { structBalance } from 'interface/structBalance'
import { decodeFromBytes } from 'nexchain/hex/decodeBytes'
import { rocksState } from 'nexchain/rocksdb/state'

export const getBalance = async (
	address: string,
): Promise<structBalance | undefined> => {
	try {
		if (!address) {
			console.info('address not provided')
			return
		}
		const balance: Buffer = (await rocksState.get(address, {
			fillCache: true,
			asBuffer: true,
		})) as Buffer
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
		return JSON.parse(decodeFromBytes(balance))
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
