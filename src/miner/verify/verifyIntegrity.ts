import { BlockChains } from '../../blockChains'
import { verifyBlock } from './module/verifyBlock'
import { verifyStruct } from './module/verifyStruct'
import { verifyPow } from './module/verifyPow'
import { verifyHashLength } from './module/verifyHashLength'

export const verifyChainIntegrity = (): boolean => {
	console.info('checking chain integrity...')
	// Check the integrity of the chain
	const blockChains = new BlockChains()
	const chains = blockChains.getChains()

	for (let i = chains.length - 1; i > 0; i--) {
		const currentBlock = chains[i]
		const prevBlock = chains[i - 1]
		if (currentBlock.blk.header.previousHash !== prevBlock.blk.header.hash) {
			return false // Chain integrity compromised
		}
		// You can add other verification checks here, such as:
		verifyHashLength(currentBlock.blk.header.hash)
		verifyBlock(
			currentBlock,
			currentBlock.blk.header.nonce,
			currentBlock.blk.header.hash,
		)
		verifyPow(currentBlock)
		verifyStruct(currentBlock)
	}
	setTimeout(() => {
		console.info('Chain integrity verified')
	}, 500)
	return true // Chain integrity verified
}
