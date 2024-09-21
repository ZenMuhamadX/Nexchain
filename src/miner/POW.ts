import crypto from 'crypto'
import { Block } from '../model/blocks/block'
import { structBlockReadyToHash } from '../lib/block/blkReadyToHash'

const DIFFICULTY_PREFIX = '00000' // Adjust according to desired difficulty criteria

interface VerifiedResult {
	nonce: string
	hash: string
}

// Perform Proof of Work algorithm to find a valid nonce
export const proofOfWork = (block: Block): VerifiedResult => {
	let nonce = 0
	const readyBlock = structBlockReadyToHash(block)

	while (true) {
		const nonceBuffer = Buffer.from(nonce.toString())
		const combineBlock = Buffer.concat([readyBlock, nonceBuffer])

		// Compute SHA-256 hash
		const hash = crypto.createHash('sha256').update(combineBlock).digest('hex')

		// Check if hash meets the difficulty criteria
		if (hash.startsWith(DIFFICULTY_PREFIX)) {
			return { nonce: nonce.toString(), hash }
		}

		nonce++ // Increment nonce and try again
	}
}
