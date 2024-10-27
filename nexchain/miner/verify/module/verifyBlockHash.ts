import { createHash } from 'crypto'
import { prepareBlockForHashing } from 'nexchain/block/prepareBlock'
import { Block } from 'nexchain/model/block/block'

export const verifyBlockHash = (currentBlock: Block) => {
	const blockReadyToHash = prepareBlockForHashing(currentBlock)
	const combineBlock = `${blockReadyToHash}${currentBlock.block.header.nonce}`
	// Compute SHA-256 hash
	const hash = createHash('sha256').update(combineBlock).digest('hex')
	if (hash !== currentBlock.block.header.hash) {
		throw new Error('Block hash is invalid')
	}
	return hash === currentBlock.block.header.hash
}
