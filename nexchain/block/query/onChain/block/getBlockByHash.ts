import { HexString } from 'interface/structBlock'
import { Block } from 'nexchain/model/block/block'
import { rocksBlock } from 'nexchain/db/block'
import { base58ToString } from 'nexchain/hex/base58/base58ToString'
import { stringToHex } from 'nexchain/hex/stringToHex'

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
