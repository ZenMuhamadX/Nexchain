import { leveldbHistory } from 'src/leveldb/history'
import { txInterface } from 'src/model/interface/memPool.inf'

interface savedHistory extends txInterface {
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
