import { createSignature } from 'nexchain/lib/block/createSignature'
import { createTxnHash } from 'nexchain/lib/hash/createTxHash'
import { comTxInterface } from 'interface/structComTx'
import { MemPool } from 'nexchain/model/memPool/memPool'
import { TxInterface } from 'interface/structTx'
import { loadWallet } from 'nexchain/account/utils/loadWallet'

export const createTransact = async (transaction: comTxInterface) => {
	const x = new MemPool()
	const convertTx: TxInterface = {
		amount: transaction.amount,
		receiver: transaction.receiver,
		sender: transaction.sender,
		timestamp: transaction.timestamp,
		fee: ((transaction.amount / 10000) * 2) / 1000,
		isPending: true,
		isValid: false,
		message: Buffer.from(
			`NexChains A Next Generation Blockchain for Everyone \n ${transaction.message}`,
		),
		status: 'pending',
	}
	const { privateKey } = loadWallet()!
	convertTx.signature = createSignature(convertTx, privateKey).signature
	convertTx.txHash = createTxnHash(convertTx)
	const added = await x.addTransaction(convertTx)
	if (added) {
		console.log('Transaction added successfully waiting for confirmation')
	} else {
		console.log('Failed to add transaction')
	}
}
