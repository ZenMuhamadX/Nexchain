/** @format */

import crypto from 'crypto'
import { txInterface } from '../../model/interface/memPool.inf'

// Membuat hash dari data transaksi dengan nonce yang diberikan.
export const createTxnHash = (data: txInterface): string => {
	const txData = {
		from: data.from,
		to: data.to,
		amount: data.amount,
		message: data.message,
		timestamp: data.timestamp,
	}
	const stringData = JSON.stringify(txData)
	const hash = crypto
		.createHash('SHA256')
		.update(Buffer.from(stringData))
		.digest('hex')
	return `TxC${hash}`
}
