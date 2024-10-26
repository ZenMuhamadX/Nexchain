import { keccak256 } from 'js-sha3'
import { addChecksum } from 'nexchain/account/utils/addChecksum'
import { processPubKey } from 'nexchain/account/utils/processPubKey'

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

	// Add checksum to the versioned address
	const addressWithCheckSum = addChecksum(versionAddress)

	return `NxC${keccak256(addressWithCheckSum).slice(-40)}`
}
