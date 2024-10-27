/** @format */
import { Block } from '../../model/block/block'
import { setBlockState } from '../state/setState'
import { writeBlockHash } from './writeBlockData'
import { writeBlockHeight } from '../state/indexing'

// Fungsi untuk menyimpan Block ke dalam file
export const saveBlock = async (blockData: Block): Promise<boolean> => {
	try {
		const blockHash = blockData.block.header.hash
		const blockHeight = blockData.block.height
		await writeBlockHash(blockHash, blockData)
		await writeBlockHeight(blockHeight, blockHash)
		await setBlockState(blockData)
		console.info(`Block ${blockHash} successfully mined.`)
		return true
	} catch (error) {
		// Tangani error jika proses penyimpanan gagal
		console.error('Error saving block:', error)
		return false
	}
}
