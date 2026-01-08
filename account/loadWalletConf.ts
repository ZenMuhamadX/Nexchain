import { existsSync, readFileSync } from 'fs'
import { WalletConfig } from 'interface/walletConfig'
import { loggingDebug } from 'logging/debug'
import { logToConsole } from 'logging/logging'
import path from 'path'
import { setWalletConfig } from './setWalletConf'

/**
 * Loads the wallet configuration file and returns its content as a WalletConfig object.
 * @returns {WalletConfig | null} The wallet configuration object, or null if the file does not exist or an error occurs.
 */
export const loadWalletConfig = (): WalletConfig | null => {
	loggingDebug(
		'loadWalletConfig',
		'Initializing wallet configuration loading process.',
	)

	// Define the directory and file paths for the wallet configuration
	const configDirectoryPath = path.join(__dirname, '../../config/')
	const walletConfigFilePath = path.join(
		configDirectoryPath,
		'wallet.conf.json',
	)

	// Check if the configuration file exists
	if (!existsSync(walletConfigFilePath)) {
		logToConsole(
			'Wallet configuration file does not exist. creating wallet config',
		)
		setWalletConfig()
	}

	try {
		// Read the file content and parse it into a WalletConfig object
		const fileContent = readFileSync(walletConfigFilePath, 'utf-8')
		const walletConfig: WalletConfig = JSON.parse(fileContent)

		loggingDebug(
			'loadWalletConfig',
			'Wallet configuration successfully loaded.',
		)

		return walletConfig // Return the parsed WalletConfig object
	} catch (error) {
		console.error('Error loading wallet configuration:', error)
		return null // Return null if an error occurs
	}
}
