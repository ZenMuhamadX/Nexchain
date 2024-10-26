/** @format */
import { loggingErr } from 'logging/errorLog'
import { generateTimestampz } from 'nexchain/lib/generateTimestampz'
import { generateAddressFromPublicKey } from 'nexchain/keyPair/genAddrFromPubKey'
import { genRandomMnemonic } from 'nexchain/keyPair/genRandomMnemonic'
import { generateKeysFromMnemonic } from 'nexchain/keyPair/genKeyFromMnemonic'
import { saveWallet } from './utils/saveWallet'
import { putNewWallet } from './balance/putNewWallet'
import { showHeader } from 'cli(Development)/figlet/header'
import { askQuestion } from 'cli(Development)/question/askQuestion'

// Creates a new wallet address and saves it
export const createNewWalletAddress = async (): Promise<{
	address: string | undefined
	phrase: string | undefined
}> => {
	showHeader('NexCLI Wallet')
	console.log('Generating new wallet...')

	// Pertanyaan konfirmasi untuk membuat wallet baru
	const createWallet = await askQuestion({
		type: 'confirm',
		name: 'createWallet',
		message: 'Do you want to create a new wallet?',
		default: true,
	})

	// Jika pengguna tidak ingin membuat wallet baru, keluar dari fungsi
	if (!createWallet) {
		console.log('Exiting CLI...')
		process.exit(0) // Keluar dari CLI
	}

	// Mengambil input pengguna untuk phraseLength dan fileName
	const phraseLength = await askQuestion({
		type: 'list',
		name: 'phraseLength',
		message: 'Select phrase length:',
		choices: [
			{ name: '12', value: 12 },
			{ name: '24', value: 24 },
		],
	})

	const fileName = await askQuestion({
		type: 'input',
		name: 'fileName',
		message: 'Enter file name:',
	})

	try {
		const mnemonic = genRandomMnemonic(phraseLength)

		const { publicKey, privateKey } = generateKeysFromMnemonic(mnemonic)

		const walletAddress = generateAddressFromPublicKey(publicKey.slice(2))

		putNewWallet(walletAddress)

		await saveWallet(
			{ mnemonic, privateKey, publicKey, walletAddress },
			fileName,
		)

		// Return the formatted wallet address
		return { address: walletAddress, phrase: mnemonic }
	} catch (error) {
		loggingErr({
			context: 'createWalletAddress',
			error,
			stack: new Error().stack,
			time: generateTimestampz(),
			hint: '',
			warning: null,
		})
		return { address: undefined, phrase: undefined }
	}
}
