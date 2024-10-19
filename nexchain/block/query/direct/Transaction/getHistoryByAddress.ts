import { leveldbHistory } from 'nexchain/leveldb/history'

export const getHistoryByAddress = async (address: string) => {
	const dataTransaction = await leveldbHistory.get(`${address}`, {
		fillCache: true,
	})
	if (!dataTransaction) return []
	return dataTransaction
}
