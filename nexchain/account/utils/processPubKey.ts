import crypto from 'crypto'
import { generateTimestampz } from 'nexchain/lib/generateTimestampz'
import { loggingErr } from 'logging/errorLog'

// Process public key to create a wallet address
export const processPubKey = (publicKey: string): Buffer | undefined => {
	try {
		// Validate the public key input
		if (typeof publicKey !== 'string' || !/^[0-9a-fA-F]+$/.test(publicKey)) {
			loggingErr({
				context: 'processPubKey',
				level: 'error',
				priority: 'high',
				hint: 'Invalid public key',
				message: 'Invalid public key format must be a hexadecimal string.',
				stack: new Error().stack!,
				timestamp: generateTimestampz(),
			})
			return undefined
		}

		// Create SHA256 hash from the public key
		return crypto
			.createHash('sha256')
			.update(Buffer.from(publicKey, 'hex'))
			.digest()
	} catch (error) {
		loggingErr({
			context: 'processPubKey',
			hint: 'Error processing public key',
			stack: new Error().stack!,
			timestamp: generateTimestampz(),
			level: 'error',
			priority: 'high',
			message: 'Error processing public key',
		})
		return undefined
	}
}
