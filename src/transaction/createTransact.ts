import { MemPoolInterface } from 'src/model/interface/memPool.inf'
import { MemPool } from 'src/model/memPool/memPool'

export const createTransact = async (transaction: MemPoolInterface) => {
	const x = new MemPool()
	const added = await x.addTransaction(transaction)
	if (added) {
		console.log('Transaction added successfully waiting for confirmation')
	} else {
		console.log('Failed to add transaction')
	}
}
