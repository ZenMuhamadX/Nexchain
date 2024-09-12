/** @format */

import { createHmac } from 'crypto'

// Fungsi untuk menandatangani data
export const generateSignature = (
	dataOrAddress: string,
	privateKey: string,
): string => {
	// Membuat HMAC dengan algoritma SHA-256
	const hmac = createHmac('sha256', privateKey)

	// Menambahkan data ke HMAC
	hmac.update(dataOrAddress)

	// Menghasilkan signature dalam format hexadecimal
	const signature = hmac.digest('hex')

	return signature
}
