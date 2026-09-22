import { generateTimestampz } from 'nexchain core/lib/generateTimestampz'
import { loggingErr } from 'logging/errorLog'
import { rocksState } from 'nexchain core/db/state'
import { isValidAddress } from 'nexchain core/transaction/utils/isValidAddress'
import { logToConsole } from 'logging/logging'
import { hexToString } from 'nexchain core/hex/hexToString'
import { HexString } from 'interface/common/hexString'
import { structBalanceCore } from 'interface/core/structBalanceCore'
import { JSONParse } from 'nexchain core/lib/JSONParse'
import { stringToBigInt } from '../lib/stringToBigint'

/**
 * Fetches the balance of an address from the RocksDB state.
 * @param address - The address to fetch the balance for.
 * @returns A Promise resolving to the balance or undefined in case of errors.
 */
export const loadAccountCore = async (
	address: string,
): Promise<structBalanceCore | undefined> => {
	try {
		// Validate the address input
		if (!isValidInput(address)) {
			return
		}

		// Fetch balance from the RocksDB state
		const data = await fetchBalanceFromDB(address)
		if (!data) {
			return createDefaultBalance(address)
		}

		// Decode and parse balance data
		return stringToBigInt(parseBalanceData(data, address))
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
const fetchBalanceFromDB = async (
	address: string,
): Promise<HexString | null> => {
	const data = await rocksState
		.get(address, { fillCache: true })
		.catch(() => null)
	return data as HexString
}

/**
 * Creates a default balance object for an address.
 * @param address - The address to create the default balance for.
 * @returns A structBalance object with default values.
 */
const createDefaultBalance = (address: string): structBalanceCore => ({
	address,
	balance: 0n,
	transactionCount: 0,
	isContract: false,
	lastTransactionDate: null,
	nonce: 0,
})

/**
 * Decodes and parses balance data from a Buffer.
 * @param balanceBuffer - The balance data as a Buffer.
 * @param address - The associated address.
 * @returns A structBalance object parsed from the data.
 */
const parseBalanceData = (
	data: HexString,
	address: string,
): structBalanceCore => {
	try {
		return JSONParse(hexToString(data))
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
