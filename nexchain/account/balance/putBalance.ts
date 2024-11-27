import { loggingErr } from 'logging/errorLog'
import { structBalance } from 'interface/structBalance'
import { generateTimestampz } from 'nexchain/lib/generateTimestampz'
import { rocksState } from 'nexchain/rocksdb/state'
import { encodeToBytes } from '../../hex/encodeToBytes'

/**
 * Updates the balance for a given address in RocksDB.
 * @param address - The address whose balance will be updated.
 * @param balance - The balance data to store.
 */
export const putBalance = async (
	address: string,
	balance: structBalance,
): Promise<void> => {
	try {
		// Validate input
		if (!isValidInput(address, balance)) {
			logInvalidInputError()
			return
		}

		// Ensure timesTransaction is defined
		balance.timesTransaction = balance.timesTransaction ?? 0

		// Encode balance and save to RocksDB
		const encodedBalance = encodeBalanceData(balance)
		await saveToDB(address, encodedBalance)
	} catch (error) {
		handleUnexpectedError(error)
	}
}

/**
 * Validates the input for address and balance.
 * @param address - The address to validate.
 * @param balance - The balance object to validate.
 * @returns True if the input is valid, false otherwise.
 */
const isValidInput = (address: string, balance: structBalance): boolean => {
	return Boolean(address && balance)
}

/**
 * Logs an error when the input validation fails.
 */
const logInvalidInputError = (): void => {
	loggingErr({
		level: 'error',
		message: 'Error putting data or data not found',
		stack: new Error().stack!,
		hint: 'Address or balance is missing',
		timestamp: generateTimestampz(),
		priority: 'high',
		context: 'leveldb putBalance',
	})
}

/**
 * Encodes the balance data to a byte format.
 * @param balance - The balance object to encode.
 * @returns A Buffer containing the encoded balance data.
 */
const encodeBalanceData = (balance: structBalance): Buffer => {
	return encodeToBytes(JSON.stringify(balance))
}

/**
 * Saves encoded balance data to RocksDB.
 * @param address - The address associated with the balance.
 * @param encodedBalance - The encoded balance data.
 */
const saveToDB = async (
	address: string,
	encodedBalance: Buffer,
): Promise<void> => {
	await rocksState.put(address, encodedBalance, {
		sync: false, // Option for asynchronous write
	})
}

/**
 * Handles unexpected errors during the put operation.
 * @param error - The error that occurred.
 */
const handleUnexpectedError = (error: unknown): void => {
	console.error(error)
	loggingErr({
		level: 'error',
		message: 'Error putting data',
		timestamp: generateTimestampz(),
		priority: 'high',
		context: 'leveldb putBalance',
		stack: new Error().stack! as string,
		hint: 'An unexpected error occurred while putting data.',
	})
}
