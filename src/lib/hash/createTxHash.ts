/** @format */

import crypto from 'crypto'
import { memPoolInterface } from '../../model/interface/memPool.inf'

// Membuat hash dari data transaksi dengan nonce yang diberikan.
export const createTxHash = (data: memPoolInterface): string => {
	const txObj = {
		from: data.from,
		to: data.to,
		amount: data.amount,
		message: data.message,
	}
	const stringData = JSON.stringify(txObj)
	const hash = crypto
		.createHash('sha256')
		.update(Buffer.from(stringData))
		.digest('hex')
	return `TxN${hash}`
}
