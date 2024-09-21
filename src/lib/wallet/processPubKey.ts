import crypto from 'crypto'
import { loggingErr } from 'src/logging/errorLog'
import { generateTimestampz } from '../timestamp/generateTimestampz'

// Process public key to create a wallet address
export const processPubKey = (publicKey: string):Buffer | undefined => {
	try {
		// Validate the public key input
		if (typeof publicKey !== 'string' || !/^[0-9a-fA-F]+$/.test(publicKey)) {
			loggingErr({
				error: 'Invalid public key format must be a hexadecimal string.',
				stack: new Error().stack,
				time: generateTimestampz(),
			})
			return undefined
		}

		// Create SHA256 hash from the public key
		const sha256Hash:Buffer = crypto
			.createHash('sha256')
			.update(Buffer.from(publicKey, 'hex'))
			.digest()

		// Create RIPEMD160 hash from the SHA256 hash
		const ripemd160Hash:Buffer = crypto
			.createHash('ripemd160')
			.update(sha256Hash)
			.digest()

		// Return the RIPEMD160 hash as the wallet address
		return ripemd160Hash
	} catch (error) {
		loggingErr({
			error,
			stack: new Error().stack,
			time: generateTimestampz(),
		})
		return undefined
	}
}
