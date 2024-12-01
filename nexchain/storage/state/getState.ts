import { rocksState } from 'nexchain/db/state'
import { blockState } from './setState'
import { hexToString } from 'nexchain/hex/hexToString'
import { HexString } from 'interface/structBlock'

export const getBlockState = async (): Promise<blockState | undefined> => {
	const data = (await rocksState.get(`blockState`, {
		asBuffer: false,
		fillCache: true,
	})) as HexString
	if (data) {
		return JSON.parse(hexToString(data)) as blockState
	} else {
		return undefined
	}
}
