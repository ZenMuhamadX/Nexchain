import { TxNormalized } from 'wallet/domain/TxNormalized'

const TX_WIRE_SIZE = 90

const readU64 = (buffer: Uint8Array, offset: number): bigint => {
	let value = 0n
	for (let i = 0; i < 8; i++) {
		value = (value << 8n) | BigInt(buffer[offset + i])
	}
	return value
}

export const decodeTxWire = (buffer: Uint8Array): TxNormalized => {
	if (buffer.length !== TX_WIRE_SIZE) {
		throw new Error('Invalid tx wire size')
	}

	let offset = 0

	// Read 'from' address
	const from = buffer.slice(offset, offset + 32)
	offset += 32

	// Read 'to' address
	const to = buffer.slice(offset, offset + 32)
	offset += 32

	// Read 'amount'
	const amount = readU64(buffer, offset)
	offset += 8

	// Read 'fee'
	const fee = readU64(buffer, offset)
	offset += 8

	// Read 'nonce'
	const nonce = readU64(buffer, offset)
	offset += 8

	return {
		from,
		to,
		amount,
		fee,
		nonce,
	}
}
