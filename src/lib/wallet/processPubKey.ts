import crypto from 'crypto'

// Process public key to create a wallet address
export const processPubKey = (publicKey: string) => {
	try {
		// Validate the public key input
		if (typeof publicKey !== 'string' || !/^[0-9a-fA-F]+$/.test(publicKey)) {
			throw new Error(
				'Invalid public key format. Must be a hexadecimal string.',
			)
		}

		// Create SHA256 hash from the public key
		const sha256Hash = crypto
			.createHash('sha256')
			.update(Buffer.from(publicKey, 'hex'))
			.digest()

		// Create RIPEMD160 hash from the SHA256 hash
		const ripemd160Hash = crypto
			.createHash('ripemd160')
			.update(sha256Hash)
			.digest()

		// Return the RIPEMD160 hash as the wallet address
		return ripemd160Hash
	} catch (error) {
		console.error('Error processing public key:', error)
	}
}
