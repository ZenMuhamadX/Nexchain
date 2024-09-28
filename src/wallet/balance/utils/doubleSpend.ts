import { getDataTransaction } from 'src/leveldb/query/transaction/getData'

export const handleDoubleSpend = async (
	txHash: string,
): Promise<{ doubleSpend: boolean; txHash: string }> => {
	// const response = await getDataTransaction(txHash)
	// if (response) {
	// 	return { doubleSpend: true, txHash }
	// } else {
	// 	return { doubleSpend: false, txHash }
	// }
	return { doubleSpend: false, txHash: '' }
}
