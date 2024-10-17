import { entropyToMnemonic } from 'bip39'
import crypto from 'crypto'

export const generatePhrase = () => {
	const entropy = crypto.randomBytes(32)
	return entropyToMnemonic(entropy)
}
