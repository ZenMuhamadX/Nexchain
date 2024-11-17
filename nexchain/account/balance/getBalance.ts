import { generateTimestampz } from 'nexchain/lib/generateTimestampz'
import { loggingErr } from 'logging/errorLog'
import { structBalance } from 'interface/structBalance'
import { decodeFromBytes } from 'nexchain/hex/decodeBytes'
import { rocksState } from 'nexchain/rocksdb/state'
import { isValidAddress } from 'nexchain/transaction/utils/isValidAddress'

export const getBalance = async (
	address: string,
): Promise<structBalance | undefined> => {
	try {
		const isValidAddr = isValidAddress(address)
		if (!isValidAddr) {
			console.info('invalid address')
			return
		}
		if (!address) {
			console.info('address not provided')
			return
		}
		const balance: Buffer = (await rocksState
			.get(address, {
				fillCache: true,
				asBuffer: true,
			})
			.catch(() => null)) as Buffer
		if (!balance) {
			return {
				address,
				balance: 0,
				timesTransaction: 0,
				isContract: false,
				lastTransactionDate: null,
				nonce: 0,
				decimal: 18,
				notes: '',
				symbol: 'nexu',
			}
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
