import crypto from 'crypto'
import { generateTimestampz } from 'src/lib/timestamp/generateTimestampz'
import { loggingErr } from 'src/logging/errorLog'

// Process public key to create a wallet address
export const processPubKey = (publicKey: string): Buffer | undefined => {
	try {
		// Validate the public key input
		if (typeof publicKey !== 'string' || !/^[0-9a-fA-F]+$/.test(publicKey)) {
			loggingErr({
				context: 'processPubKey',
				hint: 'Invalid public key',
				warning: null,
				error: 'Invalid public key format must be a hexadecimal string.',
				stack: new Error().stack,
				time: generateTimestampz(),
			})
			return undefined
		}

		// Create SHA256 hash from the public key
		const sha256Hash: Buffer = crypto
			.createHash('sha256')
			.update(Buffer.from(publicKey, 'hex'))
			.digest()

		// Create RIPEMD160 hash from the SHA256 hash
		const ripemd160Hash: Buffer = crypto
			.createHash('ripemd160')
			.update(sha256Hash)
			.digest()

		// Return the RIPEMD160 hash as the wallet address
		return ripemd160Hash
	} catch (error) {
		loggingErr({
			context: 'processPubKey',
			hint: 'Error processing public key',
			warning: null,
			error,
			stack: new Error().stack,
			time: generateTimestampz(),
		})
		return undefined
	}
}
