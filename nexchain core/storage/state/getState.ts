import { rocksState } from 'nexchain core/db/state'
import { blockState } from './setState'
import { hexToString } from 'nexchain core/hex/hexToString'
import { JSONParse } from 'nexchain core/lib/JSONParse'
import { HexString } from 'interface/common/hexString'

export const getBlockState = async (): Promise<blockState | undefined> => {
	const data = (await rocksState.get(`blockState`, {
		fillCache: true,
	})) as HexString
	if (data) {
		return JSONParse(hexToString(data)) as blockState
	} else {
		return undefined
	}
}
