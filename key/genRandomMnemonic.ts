import bip39 from 'bip39'

export const genRandomMnemonic = () => {
	return bip39.generateMnemonic(128)
}
