import { loggingErr } from 'logging/errorLog'
import { generateTimestampz } from 'nexchain core/lib/generateTimestampz'
import { rocksState } from 'nexchain core/db/state'
import { stringToHex } from 'nexchain core/hex/stringToHex'
import { JSONStringify } from 'nexchain core/lib/JSONStringify'
import { structBalanceCore } from 'interface/core/structBalanceCore'
import { bigIntToString } from 'nexchain core/savers/lib/bigintToString'

/**
 * Creates and saves a new wallet with an initial balance to the database.
 * @param address - The address of the wallet to create.
 */
export const putNewAccount = (address: string): void => {
	try {
		if (!address) {
			logInvalidAddressError()
			return
		}

		const initAccount = createInitialAcoount(address)
		saveWalletToDB(address, initAccount)
	} catch (error) {
		handleUnexpectedError(error)
	}
}

/**
 * Logs an error when the address is invalid.
 */
const logInvalidAddressError = (): void => {
	loggingErr({
		message: 'Data address not found',
		level: 'error',
		priority: 'high',
		stack: new Error().stack!,
		hint: 'Address is required but not provided',
		timestamp: generateTimestampz(),
		context: 'leveldb putNewWallet',
	})
}

/**
 * Creates the initial balance for a new wallet.
 * @param address - The wallet address.
 * @returns The initial balance object.
 */
const createInitialAcoount = (address: string): structBalanceCore => {
	return {
		address,
		balance: 0n,
		transactionCount: 0,
		isContract: false,
		nonce: 0,
		lastTransactionDate: null,
	}
}

/**
 * Saves the wallet balance to the database (RocksDB).
 * @param address - The address of the wallet.
 * @param balance - The wallet's balance data.
 */
const saveWalletToDB = (address: string, data: structBalanceCore): void => {
	const convertedData = bigIntToString(data)
	const encodedBalance = JSONStringify(convertedData)
	const hexBalance = stringToHex(encodedBalance)
	rocksState.put(address, hexBalance, { sync: true })
}

/**
 * Handles unexpected errors during the put operation.
 * @param error - The error that occurred.
 */
const handleUnexpectedError = (error: unknown): void => {
	console.error(error)
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
