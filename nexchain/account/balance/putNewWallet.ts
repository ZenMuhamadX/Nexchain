import { loggingErr } from 'logging/errorLog'
import { structBalance } from 'interface/structBalance'
import { generateTimestampz } from 'nexchain/lib/generateTimestampz'
import { toNexu } from 'nexchain/nexucoin/toNexu'
import { rocksState } from 'nexchain/rocksdb/state'

export const putNewWallet = async (address: string): Promise<void> => {
	try {
		if (!address) {
			loggingErr({
				message: 'data address not found',
				level: 'error',
				priority: 'high',
				stack: new Error().stack!,
				hint: 'data not found',
				timestamp: generateTimestampz(),
				context: 'leveldb putNewWallet',
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
			message: 'Error putting data',
			timestamp: generateTimestampz(),
			level: 'error',
			priority: 'high',
			context: 'leveldb putNewWallet',
			stack: new Error().stack!,
			hint: 'An unexpected error occurred while putting data.',
		})
	}
}
