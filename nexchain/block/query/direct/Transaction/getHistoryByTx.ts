import { leveldbHistory } from 'nexchain/leveldb/history'
import { txInterface } from 'nexchain/model/interface/Nexcoin.inf.'

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
