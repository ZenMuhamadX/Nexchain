/** @format */

import crypto from 'node:crypto'
import { memPoolBlock } from '../../model/blocks/memPoolBlock'
import { memPoolInterface } from '../../model/interface/memPool.inf'

export const generateBlockHash = (
	index: number,
	timestamp: string,
	Tx: memPoolInterface[] | memPoolBlock[],
	previousHash?: string,
) => {
	const hash = crypto.createHash('sha256')
	hash.update(`${index}-${timestamp}-${Tx}-${previousHash}-0`)
	return hash.digest('hex')
}
