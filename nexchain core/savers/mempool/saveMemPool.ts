import { TxInterfaceCore } from 'interface/core/TxInterfaceCore'
import { rocksMempool } from 'nexchain core/db/memPool'
import { JSONStringify } from 'nexchain core/lib/JSONStringify'
import { bigIntToString } from 'nexchain core/savers/lib/bigintToString'

export const saveMempool = async (
	transaction: TxInterfaceCore,
): Promise<void> => {
	if (!transaction) {
		console.log('no data')
		return
	}
	// 1. Simpan transaksi ke LevelDB
	const convertedTx = bigIntToString(transaction)
	const parseMempool = JSONStringify(convertedTx)
	await rocksMempool.put(`0x${transaction.txHash}`, parseMempool, {
		sync: false,
	})
}
