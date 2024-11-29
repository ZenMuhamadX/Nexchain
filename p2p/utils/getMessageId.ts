import crypto from 'crypto'

export const generateMessageId = (): string => {
	const randomBytes = crypto.randomBytes(16)
	const hash = crypto.createHash('sha256').update(randomBytes).digest('hex')
	const id = hash.substring(0, 6)
	return `MSG-0x${id}`
}
