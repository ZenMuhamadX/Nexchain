import { leveldbHistory } from 'nexchain/leveldb/history'
import { TxInterface } from 'interface/structTx'

export const getHistoryByTxHash = async (
	txHash: string,
): Promise<TxInterface | null> => {
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
