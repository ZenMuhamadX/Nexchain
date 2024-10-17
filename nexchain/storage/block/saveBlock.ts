/** @format */
import { Block } from '../../model/blocks/block'
import { setBlockState } from './setState'
import { writeBlockHash } from './writeBlockData'
import { writeBlockHeight } from './indexing'

// Fungsi untuk menyimpan Block ke dalam file
export const saveBlock = (blockData: Block): boolean => {
	try {
		const blockHash = blockData.block.header.hash
		const blockHeight = blockData.block.height
		writeBlockHash(blockHash, blockData)
		writeBlockHeight(blockHeight, blockHash)
		setBlockState(blockData)
		console.info(`Block ${blockHash} successfully created.`)
		return true
	} catch (error) {
		// Tangani error jika proses penyimpanan gagal
		console.error('Error saving block:', error)
		return false
	}
}
