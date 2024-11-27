import { existsSync, mkdirSync, writeFileSync } from 'fs'
import { structWalletToSave } from 'interface/structWalletToSave'
import path from 'path'
import { logToConsole } from 'logging/logging'
import { askQuestion } from 'cli(Development)/question/askQuestion'

/**
 * Saves a wallet to a file, with user prompts for overwriting or confirmation.
 * @param data - The wallet data to save.
 * @param fileName - The name of the wallet file (without extension).
 */
export const saveWallet = async (
	data: structWalletToSave,
	fileName: string,
): Promise<void> => {
	const dirPath = getWalletDirectory()
	const filePath = path.join(dirPath, `${fileName}.json`)

	try {
		ensureDirectoryExists(dirPath)

		if (existsSync(filePath)) {
			const overwrite = await confirmOverwrite()
			if (overwrite) {
				saveToFile(filePath, data)
				logToConsole(`Wallet saved to ${filePath}`)
			} else {
				logToConsole('Wallet not saved.')
			}
		} else {
			const create = await confirmCreation(fileName)
			if (create) {
				saveToFile(filePath, data)
				console.log({
					seedPhrase: data.mnemonic,
					walletAddress: data.walletAddress,
				})
				logToConsole(`Wallet created and saved to ${filePath}`)
				logToConsole('Please Keep Your Phrase')
			} else {
				console.log({
					seedPhrase: data.mnemonic,
					walletAddress: data.walletAddress,
				})
				logToConsole('Wallet not saved')
				logToConsole('Please Keep Your Phrase')
			}
		}
	} catch (error) {
		console.error('Error saving wallet:', error)
	}
}

/**
 * Returns the wallet directory path.
 * @returns The path to the wallet directory.
 */
const getWalletDirectory = (): string => {
	return path.join(__dirname, '../../../wallet/')
}

/**
 * Ensures that the wallet directory exists, creating it if necessary.
 * @param dirPath - The wallet directory path.
 */
const ensureDirectoryExists = (dirPath: string): void => {
	if (!existsSync(dirPath)) {
		mkdirSync(dirPath, { recursive: true })
	}
}

/**
 * Prompts the user to confirm overwriting an existing wallet file.
 * @returns True if the user confirms, false otherwise.
 */
const confirmOverwrite = async (): Promise<boolean> => {
	const overwrite = await askQuestion({
		type: 'confirm',
		name: 'overwrite',
		message: 'Wallet already exists. Do you want to overwrite it?',
		default: false,
	})
	return overwrite
}

/**
 * Prompts the user to confirm saving a new wallet file.
 * @param fileName - The name of the wallet file.
 * @returns True if the user confirms, false otherwise.
 */
const confirmCreation = async (fileName: string): Promise<boolean> => {
	const create = await askQuestion({
		type: 'confirm',
		name: 'create',
		message: `Wallet created. Do you want to save it to "${fileName}"?`,
		default: true,
	})
	return create
}

/**
 * Writes the wallet data to a file.
 * @param filePath - The file path to save the wallet.
 * @param data - The wallet data to save.
 */
const saveToFile = (filePath: string, data: structWalletToSave): void => {
	writeFileSync(filePath, JSON.stringify(data, null, 2))
}
