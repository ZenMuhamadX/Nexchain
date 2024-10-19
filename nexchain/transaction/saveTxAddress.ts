import { leveldbHistory } from 'nexchain/leveldb/history'

export const saveTxAddress = async (
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
		const existingTxHashes = await leveldbHistory.get(address).catch(() => null)

		let newTxHashes: string[]

		if (!existingTxHashes) {
			// Jika alamat tidak ada, buat entry baru
			newTxHashes = [txHash]
		} else {
			// Jika alamat ada, ambil existing txHash array
			newTxHashes = JSON.parse(existingTxHashes)
			newTxHashes.push(txHash)
		}

		// Simpan array yang diperbarui kembali ke LevelDB
		await leveldbHistory.put(`adress:${address}`, JSON.stringify(newTxHashes))
	} catch (error) {
		console.error(`Error adding txHash to address ${address}:`, error)
	}
}
