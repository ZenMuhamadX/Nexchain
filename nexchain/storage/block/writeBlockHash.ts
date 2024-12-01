import { Block } from 'nexchain/model/block/block'
import { rocksBlock } from 'nexchain/db/block'
import { stringToBase58 } from 'nexchain/hex/base58/stringToBase58'

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
