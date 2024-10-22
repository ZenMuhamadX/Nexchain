import { generateAddressFromPublicKey } from 'nexchain/lib/keyPair/genAddrFromPubKey'
import { generateKeysFromMnemonic } from 'nexchain/lib/keyPair/genKeyFromMnemonic'
import bip39 from 'bip39'
import { existsSync, mkdirSync, writeFileSync } from 'fs'
import path from 'path'
import { structWalletToSave } from 'interface/structWalletToSave'

// Fungsi utama untuk mengimpor dompet dari mnemonic
export const importWalletFromMnemonic = (
	mnemonic: string,
	saveToFile?: boolean,
) => {
	const isValidMnemonic = bip39.validateMnemonic(mnemonic)

	if (!isValidMnemonic) {
		console.log('Invalid mnemonic phrase')
		process.exit()
	}

	const { privateKey, publicKey } = generateKeysFromMnemonic(mnemonic)
	const address = generateAddressFromPublicKey(publicKey.slice(2))
	console.info('Wallet found')

	const data: structWalletToSave = {
		privateKey,
		publicKey,
		mnemonic,
		walletAddress: address,
	}

	const dirPath = path.join(__dirname, '../../../wallet/')
	const filePath = path.join(dirPath, 'importedWallet.json')

	if (!existsSync(dirPath)) {
		mkdirSync(dirPath, { recursive: true })
	}

	if (saveToFile) {
		writeFileSync(filePath, JSON.stringify(data, null, 2))
	}

	return {
		privateKey,
		publicKey,
		address,
	}
}
