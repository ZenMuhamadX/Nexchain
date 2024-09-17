import { deriveKeyAndIv } from "../encrypt/encrypt"
import crypto from 'node:crypto'

export const decrypt = (encryptedText: string, password: string): string => {
	try {
		if (!encryptedText || !password)
			throw new Error('Encrypted text and password are required.')

		const [saltHex, encrypted] = encryptedText.split(':')
		if (!saltHex || !encrypted)
			throw new Error('Invalid encrypted text format.')

		const salt = Buffer.from(saltHex, 'hex')
		const { key, iv } = deriveKeyAndIv(password, salt)

		const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv)
		let decrypted = decipher.update(encrypted, 'hex', 'utf8')
		decrypted += decipher.final('utf8')

		return decrypted
	} catch (error) {
		throw new Error(' Decryption failed: Wrong password or corrupted data. ' + error)
	}
}
