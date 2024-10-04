import { verifyStruct } from './module/verifyStruct'
import { verifyPow } from './module/verifyPow'
import { verifyHashLength } from './module/verifyHashLength'
import { verifyBlockHash } from './module/verifyBlockHash'
import { loadBlocks } from 'src/storage/loadBlock'
import { Block } from 'src/model/blocks/block'

// Function to verify the integrity of the blockchain
export const verifyChainIntegrity = () => {
	console.info('Checking chain integrity...')

	// Initialize blockchain and get the list of chains
	const blockChains = loadBlocks() as Block[]

	// Loop through the chains to verify their integrity
	for (let i = blockChains.length - 1; i > 0; i--) {
		const currentBlock = blockChains[i]
		const prevBlock = blockChains[i - 1]

		// Check if the current block's previousHash matches the previous block's hash
		if (
			currentBlock.block.header.previousBlockHash !==
			prevBlock.block.header.hash
		) {
			return false // Chain integrity compromised
		}

		// Perform additional verification checks
		try {
			verifyHashLength(currentBlock.block.header.hash)
			verifyBlockHash(currentBlock)
			verifyPow(currentBlock)
			verifyStruct()
			return true // Chain integrity is valid
		} catch (error) {
			console.error('Error during verification:', error)
			return false // Verification failed
		}
	}
	return true
}
