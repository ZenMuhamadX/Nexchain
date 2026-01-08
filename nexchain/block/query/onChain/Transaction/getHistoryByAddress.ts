import { getHistoryByTxHash } from './getHistoryByTxHash'
import { TxInterface } from 'interface/structTx'
import { decodeFromBytes } from 'nexchain/hex/bytes/decodeBytes'
import { rocksHistory } from 'nexchain/db/history'

export const getHistoryByAddress = async (
	address: string,
	enc: 'json' | 'hex',
): Promise<{ history: TxInterface[]; count: number }> => {
	try {
		const txHashesStr = (await rocksHistory
			.get(`address:${address}`, { fillCache: true })
			.catch(() => null)) as string | null

		const txHashes: Buffer | null = txHashesStr
			? Buffer.from(txHashesStr)
			: null
		// Jika tidak ada txHashes, kembalikan array kosong
		if (!txHashesStr) return { count: 0, history: [] }

		const parseTxHash = JSON.parse(decodeFromBytes(txHashes!))

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
