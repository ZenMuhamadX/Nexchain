import { TxInterfaceFront } from 'interface/front/TxinterfaceFront'
import { getHistoryByTxHash } from './getHistoryByTxHash'
import { rocksHistory } from 'nexchain core/db/history'
import { JSONParse } from 'nexchain core/lib/JSONParse'

export const getHistoryByAddress = async (
	address: string,
	enc: 'json' | 'hex',
): Promise<{ history: TxInterfaceFront[]; count: number }> => {
	try {
		const txHashesStr = (await rocksHistory
			.get(`address:${address}`, { fillCache: true })
			.catch(() => null)) as string | null

		// Jika tidak ada txHashes, kembalikan array kosong
		if (!txHashesStr) return { count: 0, history: [] }

		const parseTxHash = JSONParse(txHashesStr)

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
