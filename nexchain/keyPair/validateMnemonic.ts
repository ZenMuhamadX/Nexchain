import bip39 from 'bip39'

// Fungsi untuk memvalidasi mnemonic
export const validateMnemonic = (mnemonic: string) => {
	const isValid = bip39.validateMnemonic(mnemonic)
	if (!isValid) {
		throw new Error('Invalid mnemonic phrase')
	}
}
