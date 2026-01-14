import { Block } from 'nexchain core/model/block/block'
import { rocksBlock } from 'nexchain core/db/block'
import { JSONStringify } from 'nexchain core/lib/JSONStringify'
import { stringToHex } from 'nexchain core/hex/stringToHex'
import { bigIntToString } from '../lib/bigintToString'

export const writeBlockHash = async (
	blockHash: string,
	blockData: Block,
): Promise<void> => {
	const convertedBlock = bigIntToString(blockData)
	const parsedBlockData = JSONStringify(convertedBlock)
	const encodedBlock = stringToHex(parsedBlockData)
	// Tulis Buffer ke dalam file dengan nama yang dihasilkan
	await rocksBlock.put(`blockHash:${blockHash}`, encodedBlock, {
		sync: false,
	})
}
