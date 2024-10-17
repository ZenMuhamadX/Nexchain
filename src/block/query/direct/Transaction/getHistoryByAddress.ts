import { leveldbHistory } from 'src/leveldb/history'

export const getHistoryByAddress = async (address: string) => {
	const dataTransaction = await leveldbHistory.get(`address:${address}`, {
		fillCache: true,
	})
	if (!dataTransaction) return []
	return dataTransaction
}
