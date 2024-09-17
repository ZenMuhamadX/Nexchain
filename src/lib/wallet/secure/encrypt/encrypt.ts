import crypto from 'crypto'

const ALGORITHM = 'aes-256-cbc'

// Fungsi untuk menghasilkan kunci dan IV dari password
export const deriveKeyAndIv = (
	password: string,
	salt: Buffer,
): { key: Buffer; iv: Buffer } => {
	try {
		const key = crypto.pbkdf2Sync(password, salt, 10000, 32, 'sha256')
		const iv = crypto.pbkdf2Sync(password, salt, 10000, 16, 'sha256')
		return { key, iv }
	} catch (error) {
		throw new Error('Error deriving key and IV: ' + error)
	}
}

export const encrypt = (data: string, password: string): string => {
	try {
		if (!data || !password) throw new Error('Text and password are required.')

		const salt = crypto.randomBytes(16) // Salt untuk keamanan ekstra
		const { key, iv } = deriveKeyAndIv(password, salt)

		const cipher = crypto.createCipheriv(ALGORITHM, key, iv)
		let encrypted = cipher.update(data, 'utf8', 'hex')
		encrypted += cipher.final('hex')

		return `${salt.toString('hex')}:${encrypted}`
	} catch (error) {
		throw new Error('Encryption failed: ' + error)
	}
}
