import { leveldbState } from 'nexchain/leveldb/state'
import { blockState } from './setState'

export const getBlockState = async (): Promise<blockState | undefined> => {
	const data: blockState = await leveldbState.get(`blockState`)
	if (data) {
		return data
	} else {
		return undefined
	}
}
