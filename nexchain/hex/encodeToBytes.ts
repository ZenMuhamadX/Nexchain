// Fungsi untuk mengonversi string ke bytes
export const encodeToBytes = (str: string) => {
	return Buffer.from(str, 'utf8') // Mengonversi string menjadi buffer menggunakan UTF-8
}
