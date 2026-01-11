import { Block } from 'nexchain core/model/block/block'
import { rocksBlock } from 'nexchain core/db/block'
import { stringToBase58 } from 'nexchain core/hex/base58/stringToBase58'

export const writeBlockHash = async (
	blockHash: string,
	blockData: Block,
): Promise<void> => {
	const parsedBlockData = JSON.stringify(blockData, null, 2)
	const encodedBlock = stringToBase58(parsedBlockData)
	// Tulis Buffer ke dalam file dengan nama yang dihasilkan
	await rocksBlock.put(`blockHash:${blockHash}`, encodedBlock, {
		sync: false,
	})
}
