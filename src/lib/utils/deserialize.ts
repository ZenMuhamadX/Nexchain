/** @format */

import { Block } from '../../model/blocks/block'
import msgpack from 'msgpack-lite'

// Fungsi untuk mendeserialize Buffer menjadi objek Block menggunakan BSON
export const deserializeBlockFromBinary = (buffer: Buffer): Block => {
	try {
		// Deserialize buffer kembali ke objek Block
		const deserializedBlock = msgpack.decode(buffer)

		// Cast deserializedBlock ke tipe Block yang tepat
		return deserializedBlock as Block
	} catch (error) {
		// Tangani error jika proses deserialisasi gagal
		console.error('Error deserializing block:', error)
		throw new Error('Failed to deserialize block')
	}
}
