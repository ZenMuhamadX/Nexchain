export const convertTimestampToDate = (timestamp: number): string => {
	const date = new Date(timestamp) // Konversi ke milidetik
	return date.toLocaleString() // Mengembalikan dalam format lokal
}
