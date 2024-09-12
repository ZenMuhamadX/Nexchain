import crypto from 'node:crypto'

// Menambahkan checksum ke alamat
export const addChecksum = (address: Buffer) => {
	// Membuat hash SHA256 ganda dari alamat
	const doubleSha256 = crypto.createHash('sha256').update(address).digest()
	// Membuat checksum dari 4 byte pertama dari hash SHA256 ganda
	const checksum = crypto
		.createHash('sha256')
		.update(doubleSha256)
		.digest()
		.subarray(0, 4)
	// Menggabungkan alamat dan checksum
	return Buffer.concat([address, checksum])
}
