import { leveldbHistory } from 'nexchain/leveldb/history'
import { TxInterface } from 'interface/structTx'
import { hexToString } from 'nexchain/hex/hexToString'
import { HexString } from 'interface/structBlock'

export const getHistoryByTxHash = async (
	txHash: string,
	enc: 'hex' | 'json',
): Promise<TxInterface | HexString> => {
	const data: HexString = await leveldbHistory.get(`txnHash:${txHash}`, {
		fillCache: true,
	})
	const decodedData = hexToString(data)
	if (enc === 'json') return JSON.parse(decodedData)
	return data
}
