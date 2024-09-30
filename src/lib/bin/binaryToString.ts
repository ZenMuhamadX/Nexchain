export const binaryTostring = (binary: any) => {
	return binary
		.split(' ')
		.map((bin: string) => {
			return String.fromCharCode(parseInt(bin, 2))
		})
		.join('')
}
