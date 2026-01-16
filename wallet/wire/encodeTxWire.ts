import { TxNormalized } from 'wallet/domain/TxNormalized'
const TX_WIRE_SIZE = 90

const writeU64 = (buffer: Uint8Array, offset: number, value: bigint) => {
	let v = value
	for (let i = 7; i >= 0; i--) {
		buffer[offset + i] = Number(v & 0xffn)
		v >>= 8n
	}
}
export const encodeTxWire = (tx: TxNormalized): Uint8Array => {
	if (tx.from.length !== 32) {
		throw new Error("Invalid 'from' address length")
	}
	if (tx.to.length !== 32) {
		throw new Error("Invalid 'to' address length")
	}

	const buffer = new Uint8Array(TX_WIRE_SIZE)
	let offset = 0

	// Write 'from' address
	buffer.set(tx.from, offset)
	offset += 32

	// Write 'to' address
	buffer.set(tx.to, offset)
	offset += 32

	// Write 'amount'
	writeU64(buffer, offset, tx.amount)
	offset += 8

	// Write 'fee'
	writeU64(buffer, offset, tx.fee)
	offset += 8

	// Write 'nonce'
	writeU64(buffer, offset, tx.nonce)
	offset += 8

	return buffer
}
