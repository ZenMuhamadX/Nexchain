import path from 'path'
import fs from 'fs'
import { structWalletToSave } from 'interface/structWalletToSave'
import { loadWalletConfig } from '../loadWalletConf'
import { logToConsole } from 'logging/logging'
import { loggingDebug } from 'logging/debug'

/**
 * Loads the wallet data from a file or returns undefined if the wallet is not found.
 * @returns Wallet data (structWalletToSave) or undefined if not found.
 */
export const loadWallet = (): structWalletToSave | undefined => {
	const walletName = loadPrimaryWalletName()
	const walletPath = getWalletFilePath(walletName)

	if (!walletExists(walletPath)) {
		handleWalletNotFound()
		return undefined
	}

	return readWalletData(walletPath)
}

/**
 * Loads the primary wallet name from the wallet configuration.
 * @returns The primary wallet name or undefined if the configuration is missing.
 */
const loadPrimaryWalletName = (): string | undefined => {
	const walletConfig = loadWalletConfig()
	return walletConfig?.primaryWalletName
}

/**
 * Constructs the wallet file path based on the wallet name.
 * @param walletName - The name of the wallet.
 * @returns The full file path for the wallet JSON file.
 */
const getWalletFilePath = (walletName: string | undefined): string => {
	return path.join(__dirname, `../../wallet/${walletName}.json`)
}

/**
 * Checks if the wallet file exists.
 * @param walletPath - The file path to the wallet.
 * @returns True if the wallet file exists, false otherwise.
 */
const walletExists = (walletPath: string): boolean => {
	return fs.existsSync(walletPath)
}

/**
 * Handles the case where the wallet file is not found.
 */
const handleWalletNotFound = (): void => {
	const message =
		'Wallet not found. Please configure your primary wallet in config/wallet.conf.json. If you have no wallet, please create one.'
	loggingDebug('loadWallet', message)
	logToConsole(message)
}

/**
 * Reads the wallet data from the specified file path.
 * @param walletPath - The file path to the wallet JSON file.
 * @returns The parsed wallet data as structWalletToSave.
 */
const readWalletData = (walletPath: string): structWalletToSave => {
	const walletData = fs.readFileSync(walletPath, 'utf8')
	return JSON.parse(walletData)
}
