import { HexString } from 'interface/structBlock'
import { hexToString } from 'nexchain/hex/hexToString'
import { Block } from 'nexchain/model/block/block'
import { rocksBlock } from 'nexchain/db/block'

export const getBlockByHash = async (
	hash: string,
	enc: 'hex' | 'json',
): Promise<Block | HexString> => {
	const block: HexString = (await rocksBlock.get(`blockHash:${hash}`, {
		fillCache: true,
		asBuffer: false,
	})) as HexString
	const decodedBlock = hexToString(block.toString() as HexString)
	if (enc === 'json') {
		return JSON.parse(decodedBlock)
	}
	return block
}
