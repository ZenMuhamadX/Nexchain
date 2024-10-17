/** @format */

import msgpack from 'msgpack-lite'

// Fungsi untuk meng-serialize objek Block menjadi Buffer menggunakan BSON
export const serializeDataToBinary = (block: any): Buffer => {
	try {
		// Konversi serializedBlock ke Buffer
		return msgpack.encode(block)
	} catch (error) {
		// Tangani error jika proses serialisasi gagal
		console.error('Error serializing block:', error)
		throw new Error('Failed to serialize block')
	}
}
