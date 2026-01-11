import { HexString } from 'interface/structBlock'
import { Block } from 'nexchain core/model/block/block'
import { rocksBlock } from 'nexchain core/db/block'
import { base58ToString } from 'nexchain core/hex/base58/base58ToString'
import { stringToHex } from 'nexchain core/hex/stringToHex'

export const getBlockByHash = async (
	hash: string,
	enc: 'hex' | 'json',
): Promise<Block | HexString> => {
	const block: HexString = (await rocksBlock.get(`blockHash:${hash}`, {
		fillCache: true,
	})) as HexString
	const decodedBlock = base58ToString(block)
	if (enc === 'json') {
		return JSON.parse(decodedBlock) as Block
	}
	return stringToHex(decodedBlock)
}
