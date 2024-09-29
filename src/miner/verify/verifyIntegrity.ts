import { BlockChains } from '../../blockChains'
import { verifyBlock } from './module/verifyBlock'
import { verifyStruct } from './module/verifyStruct'
import { verifyPow } from './module/verifyPow'
import { verifyHashLength } from './module/verifyHashLength'

// Function to verify the integrity of the blockchain
export const verifyChainIntegrity = (): boolean => {
	console.info('Checking chain integrity...')

	// Initialize blockchain and get the list of chains
	const blockChains = new BlockChains()
	const chains = blockChains.getChains()

	// Loop through the chains to verify their integrity
	for (let i = chains.length - 1; i > 0; i--) {
		const currentBlock = chains[i]
		const prevBlock = chains[i - 1]

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
			verifyBlock(
				currentBlock,
				currentBlock.block.header.nonce,
				currentBlock.block.header.hash,
			)
			verifyPow(currentBlock)
			verifyStruct(currentBlock)
		} catch (error) {
			console.error('Error during verification:', error)
			return false // Verification failed
		}
	}

	// Log verification success after a delay
	setTimeout(() => {
		console.info('Chain integrity verified')
	}, 500)

	return true // Chain integrity verified
}
