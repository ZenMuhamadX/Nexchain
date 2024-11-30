import { existsSync, mkdirSync, writeFileSync } from 'fs'
import { WalletConfig } from 'interface/walletConfig'
import { loggingDebug } from 'logging/debug'
import { convertTimestampToDate } from 'nexchain/lib/convertTimestamp'
import { generateTimestampz } from 'nexchain/lib/generateTimestampz'
import path from 'path'

export const setWalletConfig = () => {
	// Log the start of the wallet configuration setup process
	loggingDebug('setWalletConfig', 'Initializing wallet configuration setup.')

	// Define the directory and file paths for the wallet configuration
	const configDirectoryPath = path.join(__dirname, '../../config/')
	const walletConfigFilePath = path.join(
		configDirectoryPath,
		'wallet.conf.json',
	)

	// Create the configuration directory if it doesn't exist
	if (!existsSync(configDirectoryPath)) {
		mkdirSync(configDirectoryPath, { recursive: true })
	}

	// If the configuration file already exists, exit the function
	if (existsSync(walletConfigFilePath)) {
		return
	}

	// Define the default wallet configuration data
	const defaultWalletConfig: WalletConfig = {
		createdAt: convertTimestampToDate(generateTimestampz()), // Timestamp of creation
		isBackup: false, // Indicates whether the wallet has been backed up
		primaryWalletName: 'main', // Default wallet name
		network: 'Devnet', // Default network (e.g., Devnet or Mainnet)
	}

	// Write the default configuration to the wallet configuration file
	writeFileSync(
		walletConfigFilePath,
		JSON.stringify(defaultWalletConfig, null, 2),
	)

	// Log the successful completion of the wallet configuration setup
	loggingDebug(
		'setWalletConfig',
		`Wallet configuration successfully saved to ${walletConfigFilePath}.`,
	)
}
