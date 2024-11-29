import { rocksState } from 'nexchain/db/state'
import { blockState } from './setState'
import { decodeFromBytes } from 'nexchain/hex/decodeBytes'

export const getBlockState = async (): Promise<blockState | undefined> => {
	const data: Buffer = (await rocksState.get(`blockState`, {
		asBuffer: true,
		fillCache: true,
	})) as Buffer
	if (data) {
		return JSON.parse(decodeFromBytes(data)) as blockState
	} else {
		return undefined
	}
}
