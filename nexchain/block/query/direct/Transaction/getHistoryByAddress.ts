import _ from 'lodash'
import { leveldbHistory } from 'nexchain/leveldb/history'
import { getHistoryByTxHash } from './getHistoryByTx'
import { TxInterface } from 'interface/Nexcoin.inf'

export const getHistoryByAddress = async (
	address: string,
): Promise<{ history: TxInterface[]; count: number }> => {
	try {
		const txHashes = await leveldbHistory
			.get(`address:${address}`, { fillCache: true })
			.catch(() => null)

		// Jika tidak ada txHashes, kembalikan array kosong
		if (!txHashes) return { count: 0, history: [] }

		const parseTxHash = JSON.parse(txHashes)

		const histories = await Promise.all(
			parseTxHash.map((txHash: string) => getHistoryByTxHash(txHash)),
		)

		// Filter out undefined histories
		return { count: parseTxHash.length, history: histories }
	} catch (error) {
		console.error('Error getting history by address:', error)
		return { count: 0, history: [] }
	}
}
