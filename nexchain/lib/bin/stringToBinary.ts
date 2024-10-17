export const stringToBinary = (data: string) => {
	return data
		.split('')
		.map((char) => {
			return char.charCodeAt(0).toString(2).padStart(8, '0')
		})
		.join(' ')
}
