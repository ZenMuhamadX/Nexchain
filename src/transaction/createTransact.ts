import { createSignature } from 'src/lib/block/createSignature'
import { createTxnHash } from 'src/lib/hash/createTxHash'
import { getKeyPair } from 'src/lib/hash/getKeyPair'
import { comTxInterface } from 'src/model/interface/commonTxInterface'
import { txInterface } from 'src/model/interface/memPool.inf'
import { MemPool } from 'src/model/memPool/memPool'

export const createTransact = async (transaction: comTxInterface) => {
	const x = new MemPool()
	const convertTx: txInterface = {
		amount: transaction.amount,
		to: transaction.to,
		from: transaction.from,
		timestamp: transaction.timestamp,
		fee: ((transaction.amount / 10000) * 2) / 1000,
		isPending: true,
		isValidate: false,
		message: Buffer.from(
			`NexChains A Next Generation Blockchain for Everyone \n ${transaction.message}`,
		),
		status: 'pending',
	}
	const { privateKey } = getKeyPair()
	convertTx.signature = createSignature(convertTx, privateKey).signature
	convertTx.txHash = createTxnHash(convertTx)
	const added = await x.addTransaction(convertTx)
	if (added) {
		console.log('Transaction added successfully waiting for confirmation')
	} else {
		console.log('Failed to add transaction')
	}
}
