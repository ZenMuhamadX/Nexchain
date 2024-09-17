import { Block } from '../../../model/blocks/block'

// Function to verify if the block's hash meets the Proof of Work (PoW) difficulty
export const verifyPow = (block: Block): boolean => {
	const difficulty = 4
	const targetPrefix = '0'.repeat(difficulty) // Generate target prefix based on difficulty
	const blockHash = block.blk.header.hash

	if (!blockHash) {
		return false // Return false if hash is undefined or null
	}

	// Check if the block's hash starts with the target prefix
	return blockHash.startsWith(targetPrefix)
}
