/** @format */
import { loggingErr } from 'logging/errorLog'
import { generateTimestampz } from 'nexchain/lib/generateTimestampz'
import { logToConsole } from 'logging/logging'
import { loggingDebug } from 'logging/debug'
import { putNewAccount } from './balance/putNewAccount'
import { genRandomMnemonic } from 'key/genRandomMnemonic'
import { generateKeysFromMnemonic } from 'key/genKeyFromMnemonic'
import { generateAddressFromPublicKey } from 'key/genAddrFromPubKey'

/**
 * Generates a new wallet address, saves it, and returns the wallet address and mnemonic phrase.
 * @returns { address: string | undefined, phrase: string | undefined } The wallet address and mnemonic phrase, or undefined if an error occurs.
 */
export const createNewWalletAddress = (): {
	address: string | undefined
	phrase: string | undefined
} => {
	try {
		loggingDebug('createNewWalletAddress', 'Generating new wallet...')
		loggingDebug('createNewWalletAddress', 'Generating mnemonic phrase...')

		// Generate mnemonic phrase
		const mnemonicPhrase = genRandomMnemonic()
		loggingDebug('createNewWalletAddress', 'Mnemonic phrase generated.')

		// Generate public and private keys from mnemonic
		loggingDebug('createNewWalletAddress', 'Generating keys from mnemonic...')
		const { publicKey } = generateKeysFromMnemonic(mnemonicPhrase)
		loggingDebug('createNewWalletAddress', 'Keys generated.')

		// Derive wallet address from the public key
		loggingDebug(
			'createNewWalletAddress',
			'Generating wallet address from public key...',
		)
		const walletAddress = generateAddressFromPublicKey(publicKey.slice(2))
		loggingDebug('createNewWalletAddress', 'Wallet address generated.')

		// Update the wallet balance with the new wallet address
		putNewAccount(walletAddress)

		logToConsole('Wallet created successfully.')

		// Return the wallet address and mnemonic phrase
		return { address: walletAddress, phrase: mnemonicPhrase }
	} catch (error) {
		// Log the error and provide a hint for resolution
		loggingErr({
			context: 'createNewWalletAddress',
			message: 'Error creating wallet address',
			level: 'error',
			priority: 'high',
			stack: new Error().stack!,
			timestamp: generateTimestampz(),
			hint: 'Please try again.',
		})

		// Return undefined values in case of an error
		return { address: undefined, phrase: undefined }
	}
}
