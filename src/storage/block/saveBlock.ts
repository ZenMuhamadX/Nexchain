/** @format */
import { Block } from '../../model/blocks/block'
import { leveldb } from 'src/leveldb/block'

// Fungsi untuk menyimpan Block ke dalam file
export const saveBlock = (blockData: Block): boolean => {
	try {
		const blockHash = blockData.block.header.hash
		const blockHeight = blockData.block.height
		const block = JSON.stringify(blockData)
		// Tulis Buffer ke dalam file dengan nama yang dihasilkan
		leveldb.put(blockHash, block, {
			keyEncoding: 'buffer',
			valueEncoding: 'buffer',
			sync: true,
		})
		leveldb.put(`Height-${blockHeight}`, blockHash, {
			sync: true,
			keyEncoding: 'buffer',
			valueEncoding: 'buffer',
		})
		return true
	} catch (error) {
		// Tangani error jika proses penyimpanan gagal
		console.error('Error saving block:', error)
		return false
	}
}
