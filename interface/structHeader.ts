export interface header {
	previousBlockHash: string
	timestamp: number // Changed to number for better efficiency (UNIX timestamp)
	hash: string
	nonce: number
	version: string
	difficulty: number
	hashingAlgorithm: string // Optional, in case you want flexibility in hashing algorithms
}
