import { processPubKey } from 'account/utils/processPubKey'
import { keccak256 } from 'nexchain/block/keccak256'

// Fungsi untuk menghasilkan alamat dari public key
export const generateAddressFromPublicKey = (publicKey: string) => {
	// Generate the wallet address from the public key
	const address = processPubKey(publicKey)

	const version = 0x00

	// Combine version byte and address
	const versionAddress = Buffer.concat([
		Buffer.from([version]),
		address as Buffer,
	])

	return `NxC${keccak256(versionAddress).slice(-40)}`
}
