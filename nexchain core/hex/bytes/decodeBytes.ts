// Fungsi untuk mengonversi bytes kembali ke string
export const decodeFromBytes = (data: Buffer | any) => {
	if (!Buffer.isBuffer(data)) {
		return data
	}
	return data.toString('utf8') // Mengonversi buffer kembali menjadi string menggunakan UTF-8
}
