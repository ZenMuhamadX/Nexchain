import { loggingErr } from 'logging/errorLog'
import { structBalance } from 'interface/structBalance'
import { generateTimestampz } from 'nexchain/lib/generateTimestampz'
import { rocksState } from 'nexchain/rocksdb/state'
import { encodeToBytes } from '../../hex/encodeToBytes'

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
		const encodedBalance = encodeToBytes(JSON.stringify(balance))
		rocksState.put(address, encodedBalance),
			{
				sync: true,
			}
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
