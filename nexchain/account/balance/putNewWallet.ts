import { loggingErr } from 'logging/errorLog'
import { structBalance } from 'interface/structBalance'
import { generateTimestampz } from 'nexchain/lib/generateTimestampz'
import { toNexu } from 'nexchain/nexucoin/toNexu'
import { rocksState } from 'nexchain/rocksdb/state'

export const putNewWallet = async (address: string): Promise<void> => {
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
			balance: toNexu(0),
			timesTransaction: 0,
			isContract: false,
			nonce: 0,
			lastTransactionDate: null,
			decimal: 18,
			notes: '1^18 nexu = 1 NXC',
			symbol: 'nexu',
		}
		await rocksState.put(address, JSON.stringify(initBalance), {
			sync: false,
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
