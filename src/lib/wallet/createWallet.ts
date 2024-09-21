/** @format */

import { getKeyPair } from '../hash/getKeyPair'
import { processPubKey } from './processPubKey'
import { addChecksum } from './addChecksum'
import bs58 from 'bs58'
import { saveMainWallet } from './saveWallet'
import { loadConfig } from '../utils/loadConfig'

// Creates a new wallet address and saves it
export const createWalletAddress = () => {
	try {
		// Retrieve the public key
		const publicKey = getKeyPair().publicKey

		// Set version byte
		const version = loadConfig()?.wallet.version as number

		// Generate the wallet address from the public key
		const address = processPubKey(publicKey)

		// Combine version byte and address
		const versionAddress = Buffer.concat([
			Buffer.from([version]),
			address as Buffer,
		])

		// Add checksum to the versioned address
		const addressWithCheckSum = addChecksum(versionAddress)

		// Encode address to Base58
		const addressBase58 = bs58.encode(addressWithCheckSum)

		// Format the final wallet address
		const walletAddress = `NxC${addressBase58}`

		// Save the wallet address
		saveMainWallet(walletAddress)

		// Return the formatted wallet address
		return walletAddress
	} catch (error) {
		console.error('Error creating wallet address:', error)
		throw error // Re-throw to handle errors upstream if needed
	}
}
