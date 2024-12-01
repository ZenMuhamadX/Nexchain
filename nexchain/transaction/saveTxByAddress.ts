import { decodeFromBytes } from 'nexchain/hex/bytes/decodeBytes'
import { rocksHistory } from 'nexchain/db/history'

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
				asBuffer: true,
				fillCache: true,
			})
			.catch(() => null)) as Buffer

		let newTxHashes: string[]

		if (!existingTxHashes) {
			// Jika alamat tidak ada, buat entry baru
			newTxHashes = [txHash]
		} else {
			// Jika alamat ada, ambil existing txHash array
			newTxHashes = JSON.parse(decodeFromBytes(existingTxHashes))

			// Tambahkan txHash baru jika belum ada (untuk menghindari duplikasi)
			if (!newTxHashes.includes(txHash)) {
				newTxHashes.push(txHash)
			}
		}

		// Simpan array yang diperbarui kembali ke LevelDB
		await rocksHistory.put(`address:${address}`, JSON.stringify(newTxHashes))
	} catch (error) {
		console.error(`Error adding txHash to address ${address}:`, error)
	}
}
