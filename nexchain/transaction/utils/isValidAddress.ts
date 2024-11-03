export const isValidAddress = (address: string): boolean => {
	if (address.startsWith('NxS') && address.length === 43) return true
	if (address.startsWith('NxC') && address.length === 43) return true
	return false
}
