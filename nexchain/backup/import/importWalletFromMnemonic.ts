import chalk from 'chalk'
import bip39 from 'bip39'
import path from 'path'
import { generateAddressFromPublicKey } from 'nexchain/keyPair/genAddrFromPubKey'
import { generateKeysFromMnemonic } from 'nexchain/keyPair/genKeyFromMnemonic'
import { structWalletToSave } from 'interface/structWalletToSave'
import { writeFile } from 'fs/promises'
import { existsSync, mkdirSync } from 'fs'
import { askQuestion } from 'cli(Development)/question/askQuestion'
import { logToConsole } from 'logging/logging'

// Fungsi utama untuk mengimpor dompet dari mnemonic
export const importWalletFromMnemonic = async (
	mnemonic: string,
): Promise<{ privateKey: string; publicKey: string; address: string }> => {
	const isValidMnemonic = bip39.validateMnemonic(mnemonic)

	if (!isValidMnemonic) {
		console.log(chalk.red('Invalid mnemonic phrase. Please try again.'))
		process.exit()
	}

	const { privateKey, publicKey } = generateKeysFromMnemonic(mnemonic)
	const address = generateAddressFromPublicKey(publicKey.slice(2))
	logToConsole('Wallet found successfully!')

	const data: structWalletToSave = {
		privateKey,
		publicKey,
		mnemonic,
		walletAddress: address,
	}

	// Menanyakan apakah pengguna ingin menyimpan wallet ke file
	const saveToFile = await askQuestion({
		message: 'Do you want to save the wallet to a file?',
		type: 'confirm',
		name: 'saveToFile',
		default: true,
	})

	if (saveToFile) {
		// Meminta nama file jika pengguna memilih untuk menyimpan
		const fileName = await askQuestion({
			message: 'Enter the filename to save your wallet:',
			type: 'input',
			name: 'fileName',
			default: 'wallet',
		})

		const dirPath = path.join(__dirname, '../../../wallet/')
		const filePath = path.join(dirPath, `${fileName}.json`)

		// Membuat direktori jika belum ada
		if (!existsSync(dirPath)) {
			mkdirSync(dirPath, { recursive: true })
		}

		// Jika file sudah ada, menanyakan apakah ingin menimpa
		if (existsSync(filePath)) {
			const overwrite = await askQuestion({
				message: `File ${fileName}.json already exists. Do you want to overwrite it?`,
				type: 'confirm',
				name: 'overwrite',
				default: false,
			})

			if (!overwrite) {
				logToConsole('Wallet not saved.')
				return { privateKey, publicKey, address }
			}
		}

		// Menyimpan data wallet ke file
		await writeFile(filePath, JSON.stringify(data, null, 2))
		logToConsole(`Wallet successfully saved to ${filePath}`)
	}

	return {
		privateKey,
		publicKey,
		address,
	}
}
