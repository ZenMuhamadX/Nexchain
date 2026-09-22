import { hexToString } from 'nexchain core/hex/hexToString'
import { rocksHistory } from 'nexchain core/db/history'
import { HexString } from 'interface/common/hexString'
import { JSONParse } from 'nexchain core/lib/JSONParse'
import { TxInterfaceFront } from 'interface/front/TxinterfaceFront'

export const getHistoryByTxHash = async (
	txHash: string,
	enc: 'hex' | 'json',
): Promise<TxInterfaceFront | HexString> => {
	const data: HexString = await rocksHistory.get(`txnHash:${txHash}`, {
		fillCache: true,
	})
	const decodedData = hexToString(data)
	if (enc === 'json') return JSONParse(decodedData)
	return data
}
