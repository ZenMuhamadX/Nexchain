import { loggingErr } from 'logging/errorLog'
import { structBalance } from 'interface/structBalance'
import { generateTimestampz } from 'nexchain/lib/generateTimestampz'
import { rocksState } from 'nexchain/rocksdb/state'
import { encodeToBytes } from '../../hex/encodeToBytes'

export const putBalance = async (
	address: string,
	balance: structBalance,
): Promise<void> => {
	try {
		if (!address || !balance) {
			loggingErr({
				level: 'error',
				message: 'Error putting data or data not found',
				stack: new Error().stack!,
				hint: 'data not found',
				timestamp: generateTimestampz(),
				priority: 'high',
				context: 'leveldb putBalance',
			})
			return
		}
		if (balance.timesTransaction === undefined) {
			balance.timesTransaction = 0
		}
		const encodedBalance = encodeToBytes(JSON.stringify(balance))
		await rocksState.put(address, encodedBalance),
			{
				sync: false,
			}
	} catch (error) {
		loggingErr({
			message: 'Error putting data',
			timestamp: generateTimestampz(),
			level: 'error',
			priority: 'high',
			context: 'leveldb putBalance',
			stack: new Error().stack!,
			hint: 'An unexpected error occurred while putting data.',
		})
	}
}
