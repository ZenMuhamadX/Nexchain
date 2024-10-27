import { stringToHex } from 'nexchain/hex/stringToHex'
import { Block } from 'nexchain/model/block/block'
import { rocksState } from 'nexchain/rocksdb/state'

export const writeBlockHash = (blockHash: string, blockData: Block): void => {
	const parsedBlockData = JSON.stringify(blockData, null, 2)
	const encodedBlock = stringToHex(parsedBlockData)
	// Tulis Buffer ke dalam file dengan nama yang dihasilkan
	rocksState.put(`blockHash:${blockHash}`, encodedBlock, {
		sync: true,
	})
}
