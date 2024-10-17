import { leveldbHistory } from 'src/leveldb/history'
import { txInterface } from 'src/model/interface/memPool.inf'

export const getHistoryByTxHash = async (
	txHash: string,
): Promise<txInterface | null> => {
	const data = await leveldbHistory.get(`txnHash:${txHash}`, {
		fillCache: true,
		keyEncoding: 'utf8',
		valueEncoding: 'json',
	})
	if (data) {
		return data
	}
	return null
}
