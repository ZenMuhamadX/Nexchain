// Fungsi untuk mengubah Uint8Array ke string hex
export const bytesToHex = (arr: Uint8Array) => {
	return Array.from(arr)
		.map((byte) => byte.toString(16).padStart(2, '0'))
		.join('')
}
