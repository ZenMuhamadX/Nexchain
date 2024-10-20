/** @format */

import { comTxInterface } from 'interface/commonTxInterface'
import { TxInterface } from '../../../interface/Nexcoin.inf'
import { sha256 } from './hash'

// Membuat hash dari data transaksi dengan nonce yang diberikan.
export const createTxnHash = (data: TxInterface): string => {
	const txData: comTxInterface = {
		sender: data.sender,
		receiver: data.receiver,
		amount: data.amount,
		message: data.message,
		timestamp: data.timestamp,
	}
	const stringData = JSON.stringify(txData)
	const hash = sha256(stringData)
	return `TxC${hash}`
}
