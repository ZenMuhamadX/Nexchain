import * as crypto from 'crypto'

// Fungsi untuk mengenkripsi private key
export const encryptPrivateKey = (
	privateKey: string,
	password: string,
): { iv: string; encryptedData: string; authTag: string } =>{
	const iv = crypto.randomBytes(16) // Initialization Vector (IV)
	const salt = crypto.randomBytes(16) // Salt untuk PBKDF2
	const key = crypto.pbkdf2Sync(password, salt, 100000, 32, 'sha512') // Derive key dari password menggunakan PBKDF2

	const cipher = crypto.createCipheriv('aes-256-gcm', key, iv)

	let encryptedData = cipher.update(privateKey, 'utf8', 'hex')
	encryptedData += cipher.final('hex')

	const authTag = cipher.getAuthTag().toString('hex') // Dapatkan authentication tag

	return {
		iv: iv.toString('hex'), // Simpan IV
		encryptedData: encryptedData, // Data terenkripsi
		authTag: authTag, // Tag autentikasi
	}
}