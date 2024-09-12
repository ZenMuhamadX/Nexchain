import crypto from 'node:crypto'
import { TxBlock, TxInterface } from '../../model/blocks/TxBlock'

export const generateBlockHash = (
	index: number,
	timestamp: string,
	Tx: TxInterface[] | TxBlock[],
	previousHash?: string,
) => {
	const hash = crypto.createHash('sha256')
	hash.update(`${index}-${timestamp}-${Tx}-${previousHash}-0`)
	return hash.digest('hex')
}
