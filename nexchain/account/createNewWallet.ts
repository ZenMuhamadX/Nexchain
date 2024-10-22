/** @format */
import { putBalance } from './balance/putBalance'
import { loggingErr } from 'logging/errorLog'
import { generateTimestampz } from 'nexchain/lib/timestamp/generateTimestampz'
import { generateAddressFromPublicKey } from 'nexchain/lib/keyPair/genAddrFromPubKey'
import { genRandomMnemonic } from 'nexchain/lib/keyPair/genRandomMnemonic'
import { generateKeysFromMnemonic } from 'nexchain/lib/keyPair/genKeyFromMnemonic'
import { saveWallet } from './utils/saveWallet'

// Creates a new wallet address and saves it
export const createNewWalletAddress = (
	phraseLength: 24 | 12,
	fileName: string,
): { address: string | undefined; phrase: string | undefined } => {
	try {
		const initialBalance = 0

		const initialTimesTransaction = 0

		const mnemonic = genRandomMnemonic(phraseLength)

		const { publicKey, privateKey } = generateKeysFromMnemonic(mnemonic)

		const walletAddress = generateAddressFromPublicKey(publicKey.slice(2))

		putBalance(walletAddress, {
			balance: initialBalance,
			timesTransaction: initialTimesTransaction,
			address: walletAddress,
			isContract: false,
			nonce: 0,
			lastTransactionDate: null,
		})

		saveWallet({ mnemonic, privateKey, publicKey, walletAddress }, fileName)

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
