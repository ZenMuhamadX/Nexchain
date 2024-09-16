import crypto from 'crypto'

// Fungsi untuk mendekripsi private key
export const decryptPrivateKey = (
	encryptedData: string,
	iv: string,
	authTag: string,
	password: string,
): string => {
	const salt = crypto.randomBytes(16) // Salt yang sama digunakan dalam enkripsi
	const key = crypto.pbkdf2Sync(password, salt, 100000, 32, 'sha512') // Derive key dari password

	const decipher = crypto.createDecipheriv(
		'aes-256-gcm',
		key,
		Buffer.from(iv, 'hex'),
	)
	decipher.setAuthTag(Buffer.from(authTag, 'hex')) // Set authentication tag

	let decryptedData = decipher.update(encryptedData, 'hex', 'utf8')
	decryptedData += decipher.final('utf8')

	return decryptedData // Private key yang didekripsi
}
