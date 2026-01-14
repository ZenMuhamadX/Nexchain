import { loggingErr } from 'logging/errorLog'
import { generateTimestampz } from 'nexchain core/lib/generateTimestampz'
import { rocksState } from 'nexchain core/db/state'
import { stringToHex } from 'nexchain core/hex/stringToHex'
import { JSONStringify } from 'nexchain core/lib/JSONStringify'
import { HexString } from 'interface/common/hexString'
import { structBalanceCore } from 'interface/core/structBalanceCore'
import { bigIntToString } from '../lib/bigintToString'

/**
 * Updates the balance for a given address in RocksDB.
 * @param address - The address whose balance will be updated.
 * @param balance - The balance data to store.
 */
export const putAccountCore = async (
	address: string,
	account: structBalanceCore,
): Promise<void> => {
	try {
		// Validate input
		if (!isValidInput(address, account)) {
			logInvalidInputError()
			return
		}

		// Ensure timesTransaction is defined
		account.transactionCount = account.transactionCount ?? 0

		// Encode balance and save to RocksDB
		const convertedData = bigIntToString(account)
		const encodedBalance = encodeAccountData(convertedData)
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
const isValidInput = (address: string, balance: structBalanceCore): boolean => {
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
 * @returns A hex containing the encoded balance data.
 */
const encodeAccountData = (balance: structBalanceCore): HexString => {
	return stringToHex(JSONStringify(balance))
}

/**
 * Saves encoded balance data to RocksDB.
 * @param address - The address associated with the balance.
 * @param encodedBalance - The encoded balance data.
 */
const saveToDB = async (
	address: string,
	encodedBalance: HexString,
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
