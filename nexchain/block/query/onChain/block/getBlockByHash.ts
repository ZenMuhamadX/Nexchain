import { HexString } from 'interface/structBlock'
import { hexToString } from 'nexchain/hex/hexToString'
import { leveldb } from 'nexchain/leveldb/block'
import { Block } from 'nexchain/model/block/block'

export const getBlockByHash = async (
	hash: string,
	enc: 'hex' | 'json',
): Promise<Block | HexString> => {
	const block: HexString = await leveldb.get(`blockHash:${hash}`, {
		fillCache: true,
	})
	const decodedBlock = hexToString(block)
	if (enc === 'json') {
		return JSON.parse(decodedBlock)
	}
	return block
}
