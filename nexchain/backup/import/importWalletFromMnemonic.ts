import chalk from 'chalk'
import { generateAddressFromPublicKey } from 'nexchain/keyPair/genAddrFromPubKey'
import { generateKeysFromMnemonic } from 'nexchain/keyPair/genKeyFromMnemonic'
import bip39 from 'bip39'
import { existsSync, mkdirSync, writeFileSync } from 'fs'
import path from 'path'
import { structWalletToSave } from 'interface/structWalletToSave'
import { showHeader } from 'cli(Development)/figlet/header'
import { askQuestion } from 'cli(Development)/question/askQuestion'

// Fungsi utama untuk mengimpor dompet dari mnemonic
export const importWalletFromMnemonic = async () => {
	showHeader('NexCLI Recovery')

	console.log(
		chalk.greenBright("Welcome! Let's start the wallet import process."),
	)

	// Meminta mnemonic dari pengguna dengan instruksi tambahan
	const mnemonic = await askQuestion({
		type: 'input',
		name: 'mnemonic',
		message: 'Enter your mnemonic phrase (separated by spaces):',
	})

	const isValidMnemonic = bip39.validateMnemonic(mnemonic)

	if (!isValidMnemonic) {
		console.log(chalk.red('Invalid mnemonic phrase. Please try again.'))
		process.exit()
	}

	const { privateKey, publicKey } = generateKeysFromMnemonic(mnemonic)
	const address = generateAddressFromPublicKey(publicKey.slice(2))
	console.info(chalk.greenBright('Wallet found successfully!'))

	const data: structWalletToSave = {
		privateKey,
		publicKey,
		mnemonic,
		walletAddress: address,
	}

	// Meminta konfirmasi penyimpanan ke file
	const saveToFile = await askQuestion({
		type: 'confirm',
		name: 'saveToFile',
		message: 'Would you like to save the wallet to a file?',
		default: true,
	})

	// Jika pengguna memilih untuk menyimpan, minta nama file
	if (saveToFile) {
		const fileName = await askQuestion({
			type: 'input',
			name: 'fileName',
			message: 'Enter file name (without extension):',
			default: 'importedWallet',
		})

		const dirPath = path.join(__dirname, '../../../wallet/')
		const filePath = path.join(dirPath, `${fileName}.json`)

		// Cek apakah direktori ada, jika tidak, buat direktori
		if (!existsSync(dirPath)) {
			mkdirSync(dirPath, { recursive: true })
		}

		// Cek apakah file sudah ada
		if (existsSync(filePath)) {
			const overwrite = await askQuestion({
				type: 'confirm',
				name: 'overwrite',
				message: `File ${fileName}.json already exists. Overwrite?`,
				default: false,
			})

			// Jika pengguna tidak mengizinkan overwrite, batalkan proses
			if (!overwrite) {
				console.log(chalk.yellow('File saving canceled.'))
				return { privateKey, publicKey, address }
			}
		}

		// Menyimpan data wallet ke file
		writeFileSync(filePath, JSON.stringify(data, null, 2))
		console.info(chalk.green(`Wallet successfully saved to ${filePath}`))
	}

	return {
		privateKey,
		publicKey,
		address,
	}
}
