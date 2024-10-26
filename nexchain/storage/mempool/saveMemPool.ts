import { TxInterface } from 'interface/structTx'
import { leveldbMempool } from 'nexchain/leveldb/memPool'

export const saveMempool = async (transaction: TxInterface): Promise<void> => {
	if (!transaction) {
		console.log('no data')
		return
	}
	// 1. Simpan transaksi ke LevelDB
	await leveldbMempool.put(`0x${transaction.txHash}`, transaction, {
		sync: false,
	})
}
