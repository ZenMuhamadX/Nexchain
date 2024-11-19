import { generateTimestampz } from 'nexchain/lib/generateTimestampz'
import { loggingErr } from 'logging/errorLog'
import { structBalance } from 'interface/structBalance'
import { decodeFromBytes } from 'nexchain/hex/decodeBytes'
import { rocksState } from 'nexchain/rocksdb/state'
import { isValidAddress } from 'nexchain/transaction/utils/isValidAddress'
import { logToConsole } from 'logging/logging'

export const getBalance = async (
	address: string,
): Promise<structBalance | undefined> => {
	try {
		const isValidAddr = isValidAddress(address)
		if (!isValidAddr) {
			logToConsole('invalid address')
			return
		}
		if (!address) {
			logToConsole('address not provided')
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
			level: 'error',
			timestamp: generateTimestampz(),
			context: 'leveldb',
			stack: new Error().stack!,
			hint: 'An unexpected error occurred while getting data.',
			message: 'An unexpected error occurred while getting data.',
			priority: 'high',
		})
		return
	}
}
