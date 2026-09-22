import { Block } from 'nexchain core/model/block/block'
import { rocksBlock } from 'nexchain core/db/block'
import { JSONParse } from 'nexchain core/lib/JSONParse'
import { HexString } from 'interface/common/hexString'
import { hexToString } from 'nexchain core/hex/hexToString'

export const getBlockByHash = async (
	hash: string,
	enc: 'hex' | 'json',
): Promise<Block | HexString> => {
	const block: HexString = (await rocksBlock.get(`blockHash:${hash}`, {
		fillCache: true,
	})) as HexString
	if (enc === 'json') {
		return JSONParse(hexToString(block))
	}
	return block
}
