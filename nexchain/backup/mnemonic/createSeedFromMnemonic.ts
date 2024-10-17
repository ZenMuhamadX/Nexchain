import { mnemonicToSeedSync } from 'bip39'

export const generateSeedFromMnemonic = (
	mnemonic: string,
): {
	mnemonic: string
	seed: string
} => {
	const seed = mnemonicToSeedSync(mnemonic).toString('hex')
	return { mnemonic, seed }
}
