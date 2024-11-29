/** @format */
import { loggingErr } from 'logging/errorLog'
import { generateTimestampz } from 'nexchain/lib/generateTimestampz'
import { generateAddressFromPublicKey } from 'nexchain/keyPair/genAddrFromPubKey'
import { genRandomMnemonic } from 'nexchain/keyPair/genRandomMnemonic'
import { generateKeysFromMnemonic } from 'nexchain/keyPair/genKeyFromMnemonic'
import { saveWallet } from './utils/saveWallet'
import { showHeader } from 'client/figlet/header'
import { askQuestion } from 'client/question/askQuestion'
import { logToConsole } from 'logging/logging'
import { loggingDebug } from 'logging/debug'
import { putNewAccount } from './balance/putNewAccount'

/**
 * Generates a new wallet address, saves it, and returns the wallet address and mnemonic phrase.
 * @returns {Promise<{ address: string | undefined, phrase: string | undefined }>} The wallet address and mnemonic phrase, or undefined if an error occurs.
 */
export const createNewWalletAddress = async (): Promise<{
	address: string | undefined
	phrase: string | undefined
}> => {
	// Display the header for the CLI
	showHeader('NexCLI Wallet')
	console.log('Generating new wallet...')

	// Prompt user to confirm wallet creation
	const confirmWalletCreation = await askQuestion({
		type: 'confirm',
		name: 'createWallet',
		message: 'Do you want to create a new wallet?',
		default: true,
	})

	// Exit the CLI if the user declines wallet creation
	if (!confirmWalletCreation) {
		console.log('Exiting CLI...')
		process.exit(0) // Exit process
	}

	// Prompt user to choose mnemonic phrase length
	const phraseLengthChoice = await askQuestion({
		type: 'list',
		name: 'phraseLength',
		message: 'Select phrase length:',
		choices: [
			{ name: '12', value: 12 },
			{ name: '24', value: 24 },
		],
	})

	// Prompt user to input the wallet configuration file name
	const walletFileName = await askQuestion({
		type: 'input',
		name: 'fileName',
		message: 'Enter file name:',
	})

	try {
		loggingDebug('createNewWalletAddress', 'Generating new wallet...')
		loggingDebug('createNewWalletAddress', 'Generating mnemonic phrase...')

		// Generate mnemonic phrase based on user's choice
		const mnemonicPhrase = genRandomMnemonic(phraseLengthChoice)
		loggingDebug('createNewWalletAddress', 'Mnemonic phrase generated.')

		// Generate public and private keys from mnemonic
		loggingDebug('createNewWalletAddress', 'Generating keys from mnemonic...')
		const { publicKey, privateKey } = generateKeysFromMnemonic(mnemonicPhrase)
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

		// Save the wallet details to a file
		await saveWallet(
			{ mnemonic: mnemonicPhrase, privateKey, publicKey, walletAddress },
			walletFileName,
		)

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
