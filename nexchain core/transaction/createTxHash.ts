/** @format */

import { sha256 } from '../block/sha256'
import { JSONStringify } from 'nexchain core/lib/JSONStringify'
import { TxInterfaceCore } from 'interface/core/TxInterfaceCore'
import { comTxInterfaceCore } from 'interface/core/structComTxCore'

// Membuat hash dari data transaksi dengan nonce yang diberikan.
export const createTxnHash = (data: TxInterfaceCore): string => {
	const txData: comTxInterfaceCore = {
		sender: data.sender,
		receiver: data.receiver,
		amount: data.amount,
		extraMessage: data.extraMessage,
		format: 'nexu',
		fee: data.fee,
	}
	const stringData = JSONStringify(txData)
	const hash = sha256(stringData, 'hex')
	return `TxC${hash}`
}
