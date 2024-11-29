import _ from 'lodash'
import { getHistoryByTxHash } from './getHistoryByTx'
import { TxInterface } from 'interface/structTx'
import { decodeFromBytes } from 'nexchain/hex/decodeBytes'
import { rocksHistory } from 'nexchain/db/history'

export const getHistoryByAddress = async (
	address: string,
	enc: 'json' | 'hex',
): Promise<{ history: TxInterface[]; count: number }> => {
	try {
		const txHashes: Buffer = (await rocksHistory
			.get(`address:${address}`, { fillCache: true, asBuffer: true })
			.catch(() => null)) as Buffer

		// Jika tidak ada txHashes, kembalikan array kosong
		if (!txHashes) return { count: 0, history: [] }

		const parseTxHash = JSON.parse(decodeFromBytes(txHashes))

		const histories = await Promise.all(
			parseTxHash.map((txHash: string) => getHistoryByTxHash(txHash, enc)),
		)

		// Filter out undefined histories
		return { count: parseTxHash.length, history: histories }
	} catch (error) {
		console.error('Error getting history by address:', error)
		return { count: 0, history: [] }
	}
}
