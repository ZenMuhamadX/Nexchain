/** @format */

import { comTxInterface } from 'interface/structComTx'
import { TxInterface } from '../../../interface/structTx'
import { sha256 } from './hash'

// Membuat hash dari data transaksi dengan nonce yang diberikan.
export const createTxnHash = (data: TxInterface): string => {
	const txData: comTxInterface = {
		sender: data.sender,
		receiver: data.receiver,
		amount: data.amount,
		extraData: data.extraData,
		timestamp: data.timestamp,
		format: 'nexu',
	}
	const stringData = JSON.stringify(txData)
	const hash = sha256(stringData)
	return `TxC${hash}`
}
