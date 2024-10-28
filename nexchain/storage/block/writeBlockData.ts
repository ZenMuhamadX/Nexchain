import { stringToHex } from 'nexchain/hex/stringToHex'
import { Block } from 'nexchain/model/block/block'
import { rocksBlock } from 'nexchain/rocksdb/block'

export const writeBlockHash = async (
	blockHash: string,
	blockData: Block,
): Promise<void> => {
	const parsedBlockData = JSON.stringify(blockData, null, 2)
	const encodedBlock = stringToHex(parsedBlockData)
	// Tulis Buffer ke dalam file dengan nama yang dihasilkan
	await rocksBlock.put(`blockHash:${blockHash}`, encodedBlock, {
		sync: false,
	})
}
