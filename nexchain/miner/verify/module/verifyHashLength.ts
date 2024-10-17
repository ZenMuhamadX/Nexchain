// Function to verify if the hash length is valid (64 characters for SHA-256)
export const verifyHashLength = (hash: string): boolean => {
	// Check if the hash length is exactly 64 characters
	return hash.length === 64
}
