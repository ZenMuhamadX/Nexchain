import crypto from 'crypto'

export const sha256 = (
	data: string,
	enc: 'hex' | 'buffer',
): string | Buffer => {
	if (enc === 'buffer') return crypto.createHash('sha256').update(data).digest()
	return crypto.createHash('sha256').update(data).digest('hex')
}
