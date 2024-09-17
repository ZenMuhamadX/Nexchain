import crypto from 'crypto'
import { blockReadyToHash } from '../../../lib/block/blkReadyToHash'
import { Block } from '../../../model/blocks/block'
import { loggingErr } from '../../../logging/errorLog'
import { generateTimestampz } from '../../../lib/timestamp/generateTimestampz'

// Function to verify the block's hash and nonce
export const verifyBlock = (
	block: Block,
	nonce: string,
	expectedHash: string,
): boolean => {
	// Prepare block data for hashing
	const blockData = blockReadyToHash(block)
	const nonceBuffer = Buffer.from(nonce)
	const combinedData = Buffer.concat([blockData, nonceBuffer])

	// Compute the hash of the combined data
	const computedHash = crypto
		.createHash('sha256')
		.update(combinedData)
		.digest('hex')

	// Check if the computed hash matches the expected hash
	if (computedHash !== expectedHash) {
		loggingErr({
			error: new Error('Hash does not match'),
			stack: new Error().stack,
			time: generateTimestampz(),
		})
		return false
	}

	return true
}
