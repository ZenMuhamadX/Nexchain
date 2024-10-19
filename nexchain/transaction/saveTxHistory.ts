import { TxInterface } from 'interface/Nexcoin.inf'
import { leveldbHistory } from 'nexchain/leveldb/history'

interface savedHistory extends TxInterface {
	metadata?: {
		blockHeight: number
		blockHash: string
		blockTimestamp: number
		merkleRoot: string
	}
}

export const saveTxHistory = async (txHash: string, txData: savedHistory) => {
	await leveldbHistory.put(`txnHash:${txHash}`, txData, {
		sync: false,
		keyEncoding: 'utf-8',
		valueEncoding: 'json',
	})
}
