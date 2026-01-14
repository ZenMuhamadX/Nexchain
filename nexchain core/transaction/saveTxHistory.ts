import { stringToHex } from 'nexchain core/hex/stringToHex'
import { rocksHistory } from 'nexchain core/db/history'
import { JSONStringify } from 'nexchain core/lib/JSONStringify'
import { TxInterfaceCore } from 'interface/core/TxInterfaceCore'
import { bigIntToString } from 'nexchain core/savers/lib/bigintToString'

interface metadata extends TxInterfaceCore {
	metadata?: {
		blockHeight: number
		blockHash: string
		blockTimestamp: number
		merkleRoot: string
	}
}

export const saveTxHistory = async (txHash: string, txData: metadata) => {
	const convertedTxData = bigIntToString(txData)
	const stringData = JSONStringify(convertedTxData)
	const encodedData = stringToHex(stringData)
	await rocksHistory.put(`txnHash:${txHash}`, encodedData, {
		sync: false,
	})
}
