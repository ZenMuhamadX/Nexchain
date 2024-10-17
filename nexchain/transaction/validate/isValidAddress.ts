export const isValidAddress = (address: string): boolean => {
	const prefix = 'NxC'
	return address.startsWith(prefix) && address.length === 37
}
