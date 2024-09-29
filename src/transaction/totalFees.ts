import { MemPoolInterface } from 'src/model/interface/memPool.inf'

export const calculateTotalFees = (transaction: MemPoolInterface[]): number => {
	if (!transaction.length) return 0
	return transaction.reduce((total, transaction) => {
		return total + transaction.fee!
	}, 0)
}
