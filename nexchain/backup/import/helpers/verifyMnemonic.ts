import bip39 from 'bip39'
import { ec as EC } from 'elliptic'
import bs58 from 'bs58'
import { addChecksum } from 'nexchain/account/utils/addChecksum'
import { processPubKey } from 'nexchain/account/utils/processPubKey'
const ec = new EC('secp256k1')

export const verifyMnemonic = (
	mnemonicPhrase: string,
	seed: string,
): {
	isValid: boolean
	walletAddress: string
	pubKey: string
	privateKey: string
} => {
	const isValid = bip39.validateMnemonic(mnemonicPhrase)
	if (!isValid) {
		return {
			isValid: false,
			walletAddress: '',
			pubKey: '',
			privateKey: '',
		}
	}
	const keyPair = ec.genKeyPair({ entropy: Buffer.from(seed, 'hex') })
	const publicKey = keyPair.getPublic('hex')

	// Generate the wallet address from the public key
	const address = processPubKey(publicKey)

	const version = 0x00

	// Combine version byte and address
	const versionAddress = Buffer.concat([
		Buffer.from([version]),
		address as Buffer,
	])

	// Add checksum to the versioned address
	const addressWithCheckSum = addChecksum(versionAddress)

	// Encode address to Base58
	const addressBase58 = bs58.encode(addressWithCheckSum)

	// Format the final wallet address
	const walletAddress = `NxC${addressBase58}`

	return {
		isValid: true,
		walletAddress,
		pubKey: publicKey,
		privateKey: keyPair.getPrivate('hex'),
	}
}
