import { TxInterface } from 'interface/structTx'
import { hexToString } from 'nexchain/hex/hexToString'
import { HexString } from 'interface/structBlock'
import { decodeFromBytes } from 'nexchain/hex/decodeBytes'
import { rocksHistory } from 'nexchain/rocksdb/history'

export const getHistoryByTxHash = async (
	txHash: string,
	enc: 'hex' | 'json',
): Promise<TxInterface | HexString> => {
	const data: Buffer = (await rocksHistory.get(`txnHash:${txHash}`, {
		fillCache: true,
		asBuffer: true,
	})) as Buffer
	const decodedData = hexToString(decodeFromBytes(data) as HexString)
	if (enc === 'json') return JSON.parse(decodedData)
	return decodeFromBytes(data) as HexString
}
