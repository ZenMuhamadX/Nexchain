import { decodeFromBytes } from 'nexchain core/hex/bytes/decodeBytes'
import { rocksHistory } from 'nexchain core/db/history'
import { JSONStringify } from 'nexchain core/lib/JSONStringify'
import { JSONParse } from 'nexchain core/lib/JSONParse'

export const saveTxByAddress = async (
	sender: string,
	receiver: string,
	txHash: string,
): Promise<void> => {
	try {
		// Cek dan tambahkan txHash untuk pengirim
		await addTxHashToAddress(sender, txHash)

		// Cek dan tambahkan txHash untuk penerima
		await addTxHashToAddress(receiver, txHash)
	} catch (error) {
		console.error('Error indexing transaction:', error)
	}
}

const addTxHashToAddress = async (
	address: string,
	txHash: string,
): Promise<void> => {
	try {
		// Cek apakah alamat sudah ada di database
		const existingTxHashes: Buffer = (await rocksHistory
			.get(`address:${address}`, {
				fillCache: true,
			})
			.catch(() => null)) as unknown as Buffer

		let newTxHashes: string[]

		if (!existingTxHashes) {
			// Jika alamat tidak ada, buat entry baru
			newTxHashes = [txHash]
		} else {
			// Jika alamat ada, ambil existing txHash array
			newTxHashes = JSONParse(decodeFromBytes(existingTxHashes))

			// Tambahkan txHash baru jika belum ada (untuk menghindari duplikasi)
			if (!newTxHashes.includes(txHash)) {
				newTxHashes.push(txHash)
			}
		}

		// Simpan array yang diperbarui kembali ke LevelDB
		await rocksHistory.put(`address:${address}`, JSONStringify(newTxHashes))
	} catch (error) {
		console.error(`Error adding txHash to address ${address}:`, error)
	}
}
