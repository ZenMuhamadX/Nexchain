/** @format */
import inquirer from 'inquirer'
import { loggingErr } from 'logging/errorLog'
import { generateTimestampz } from 'nexchain/lib/generateTimestampz'
import { generateAddressFromPublicKey } from 'nexchain/keyPair/genAddrFromPubKey'
import { genRandomMnemonic } from 'nexchain/keyPair/genRandomMnemonic'
import { generateKeysFromMnemonic } from 'nexchain/keyPair/genKeyFromMnemonic'
import { saveWallet } from './utils/saveWallet'
import { putNewWallet } from './balance/putNewWallet'
import { textCli } from 'cli(Development)/figlet/textSync'

// Creates a new wallet address and saves it
export const createNewWalletAddress = async (): Promise<{
	address: string | undefined
	phrase: string | undefined
}> => {
	textCli('Wallet')
	console.log('Generating new wallet...')
	// Mengambil input pengguna untuk phraseLength dan fileName
	const { phraseLength } = await inquirer.prompt([
		{
			type: 'list',
			name: 'phraseLength',
			message: 'Select phrase length:',
			choices: [
				{ name: '12', value: 12 },
				{ name: '24', value: 24 },
			],
		},
	])

	const { fileName } = await inquirer.prompt([
		{
			type: 'input',
			name: 'fileName',
			message: 'Enter file name:',
		},
	])

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
