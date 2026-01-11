import { Buffer } from 'buffer'

export const calculateSize = (
	data: object,
): {
	byte: number
	KB: number
	MB: number
} => {
	// Mengkonversi data ke string JSON
	const jsonString = JSON.stringify(data)

	// Menghitung ukuran dalam byte menggunakan Buffer
	const byte = Buffer.byteLength(jsonString, 'utf8')

	const KB = byte / 1024
	const MB = KB / 1024

	return {
		byte,
		KB,
		MB,
	}
}
