import { createHash } from 'crypto'
import { structBlockReadyToHash } from 'src/lib/block/convertBlock'
import { Block } from 'src/model/blocks/block'

export const verifyBlockHash = (currentBlock: Block) => {
	const blockReadyToHash = structBlockReadyToHash(currentBlock)
	const nonce = currentBlock.block.header.nonce
	const nonceBuffer = Buffer.from(nonce.toString())
	const combineBlock = Buffer.concat([blockReadyToHash, nonceBuffer])
	// Compute SHA-256 hash
	const hash = createHash('sha256').update(combineBlock).digest('hex')
	if (hash !== currentBlock.block.header.hash) {
		throw new Error('Block hash is invalid')
	}
	return hash === currentBlock.block.header.hash
}
