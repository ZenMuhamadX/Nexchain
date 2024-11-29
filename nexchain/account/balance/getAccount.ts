import { generateTimestampz } from 'nexchain/lib/generateTimestampz'
import { loggingErr } from 'logging/errorLog'
import { structBalance } from 'interface/structBalance'
import { decodeFromBytes } from 'nexchain/hex/decodeBytes'
import { rocksState } from 'nexchain/rocksdb/state'
import { isValidAddress } from 'nexchain/transaction/utils/isValidAddress'
import { logToConsole } from 'logging/logging'

/**
 * Fetches the balance of an address from the RocksDB state.
 * @param address - The address to fetch the balance for.
 * @returns A Promise resolving to the balance or undefined in case of errors.
 */
export const getAccount = async (
	address: string,
): Promise<structBalance | undefined> => {
	try {
		// Validate the address input
		if (!isValidInput(address)) {
			return
		}

		// Fetch balance from the RocksDB state
		const balanceBuffer = await fetchBalanceFromDB(address)
		if (!balanceBuffer) {
			return createDefaultBalance(address)
		}

		// Decode and parse balance data
		return parseBalanceData(balanceBuffer, address)
	} catch (error) {
		handleUnexpectedError(error, 'getBalance')
		return
	}
}

/**
 * Validates the address input and logs appropriate errors.
 * @param address - The address to validate.
 * @returns True if the address is valid, false otherwise.
 */
const isValidInput = (address: string): boolean => {
	if (!address) {
		logToConsole('Address not provided')
		return false
	}
	if (!isValidAddress(address)) {
		logToConsole('Invalid address')
		return false
	}
	return true
}

/**
 * Fetches the balance of an address from RocksDB.
 * @param address - The address to fetch the balance for.
 * @returns A Promise resolving to the balance as a Buffer or null if not found.
 */
const fetchBalanceFromDB = async (address: string): Promise<Buffer | null> => {
	const data = await rocksState
		.get(address, { fillCache: true, asBuffer: true })
		.catch(() => null)
	return data as Buffer
}

/**
 * Creates a default balance object for an address.
 * @param address - The address to create the default balance for.
 * @returns A structBalance object with default values.
 */
const createDefaultBalance = (address: string): structBalance => ({
	address,
	balance: 0,
	transactionCount: 0,
	isContract: false,
	lastTransactionDate: null,
	nonce: 0,
	decimal: 18,
	notes: '',
	symbol: 'nexu',
})

/**
 * Decodes and parses balance data from a Buffer.
 * @param balanceBuffer - The balance data as a Buffer.
 * @param address - The associated address.
 * @returns A structBalance object parsed from the data.
 */
const parseBalanceData = (
	balanceBuffer: Buffer,
	address: string,
): structBalance => {
	try {
		return JSON.parse(decodeFromBytes(balanceBuffer))
	} catch {
		logToConsole(`Failed to decode balance data for address: ${address}`)
		return createDefaultBalance(address)
	}
}

/**
 * Handles unexpected errors during the balance retrieval process.
 * @param error - The error that occurred.
 * @param context - The context of the error (e.g., function name).
 */
const handleUnexpectedError = (error: unknown, context: string): void => {
	if (error instanceof Error) {
		console.error(`Error in ${context}:`, error.message)
	} else {
		loggingErr({
			level: 'error',
			timestamp: generateTimestampz(),
			context,
			stack: new Error().stack!,
			hint: `An unexpected error occurred in ${context}.`,
			message: `An unexpected error occurred in ${context}.`,
			priority: 'high',
		})
	}
}
