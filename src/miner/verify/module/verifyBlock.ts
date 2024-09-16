import crypto from 'crypto'
import { blockReadyToHash } from '../../../lib/block/blkReadyToHash'
import { Block } from '../../../model/blocks/block'
import { loggingErr } from '../../../logging/errorLog'
import { generateTimestampz } from '../../../lib/timestamp/generateTimestampz'

export const verifyBlock = (
	block: Block,
	nonce: string,
	givenHash: string,
): boolean => {
	const blockReadyToVerify = blockReadyToHash(block)
	const nonceBuffer = Buffer.from(nonce.toString())
	const combineBlock = Buffer.concat([blockReadyToVerify, nonceBuffer])
	const hash = crypto.createHash('sha256').update(combineBlock).digest('hex')
	if (hash !== givenHash) {
		loggingErr({
			error: new Error('Hash Not Match'),
			stack: new Error().stack,
			time: generateTimestampz(),
		})
		return false
	}
	// Periksa apakah hash yang dihasilkan sama dengan hash yang diberikan
	return hash === givenHash
}
