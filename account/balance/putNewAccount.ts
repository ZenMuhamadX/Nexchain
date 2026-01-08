import { loggingErr } from 'logging/errorLog'
import { structBalance } from 'interface/structBalance'
import { generateTimestampz } from 'nexchain/lib/generateTimestampz'
import { rocksState } from 'nexchain/db/state'
import { stringToHex } from 'nexchain/hex/stringToHex'

/**
 * Creates and saves a new wallet with an initial balance to the database.
 * @param address - The address of the wallet to create.
 */
export const putNewAccount = async (address: string): Promise<void> => {
	try {
		if (!address) {
			logInvalidAddressError()
			return
		}

		const initBalance = createInitialBalance(address)
		await saveWalletToDB(address, initBalance)
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
const createInitialBalance = (address: string): structBalance => {
	return {
		address,
		balance: 0,
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
const saveWalletToDB = async (
	address: string,
	balance: structBalance,
): Promise<void> => {
	const encodedBalance = JSON.stringify(balance)
	const hexBalance = stringToHex(encodedBalance)
	await rocksState.put(address, hexBalance, { sync: true })
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
