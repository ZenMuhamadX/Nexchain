import bip39 from 'bip39'

export const genRandomMnemonic = (length: 24 | 12 = 12) => {
	let bytes: number = 128
	if (length === 24) bytes = 256
	return bip39.generateMnemonic(bytes)
}
