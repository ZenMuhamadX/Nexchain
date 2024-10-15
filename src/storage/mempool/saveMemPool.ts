import { txInterface } from 'src/model/interface/memPool.inf'
import { leveldbMempool } from 'src/leveldb/memPool'

export const saveMempool = async (transaction: txInterface) => {
	if (!transaction) {
		console.log('no data')
		return
	}
	const txHash = transaction.txHash!
	// 1. Simpan transaksi ke LevelDB
	await leveldbMempool.put(`0x${txHash}`, transaction, {
		sync: false,
		keyEncoding: 'utf8',
		valueEncoding: 'json',
	})
}
