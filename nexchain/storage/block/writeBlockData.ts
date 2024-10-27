import { stringToHex } from 'nexchain/hex/stringToHex'
import { Block } from 'nexchain/model/block/block'
import { rocksBlock } from 'nexchain/rocksdb/block'

export const writeBlockHash = (blockHash: string, blockData: Block): void => {
	const parsedBlockData = JSON.stringify(blockData, null, 2)
	const encodedBlock = stringToHex(parsedBlockData)
	// Tulis Buffer ke dalam file dengan nama yang dihasilkan
	rocksBlock.put(`blockHash:${blockHash}`, encodedBlock, {
		sync: true,
	})
}
