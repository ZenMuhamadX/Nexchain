// Fungsi untuk mengonversi bytes kembali ke string
export const decodeFromBytes = (buffer: Buffer) => {
	return buffer.toString('utf8') // Mengonversi buffer kembali menjadi string menggunakan UTF-8
}
