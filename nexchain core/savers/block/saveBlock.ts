/** @format */
import { Block } from '../../model/block/block'
import { setBlockState } from '../../storage/state/setState'
import { writeBlockHash } from './writeBlockHash'
import { writeBlockHeight } from '../../storage/state/indexing'
import { bigIntToString } from 'nexchain core/savers/lib/bigintToString'

// Fungsi untuk menyimpan Block ke dalam file
export const saveBlock = async (blockData: Block): Promise<boolean> => {
	try {
		const convertedBlockData = bigIntToString(blockData) as Block
		const blockHash = blockData.block.header.hash
		const blockHeight = blockData.block.height
		await writeBlockHash(blockHash, convertedBlockData)
		await writeBlockHeight(blockHeight, blockHash)
		await setBlockState(convertedBlockData)
		return true
	} catch (error) {
		// Tangani error jika proses penyimpanan gagal
		console.error('Error saving block:', error)
		return false
	}
}
