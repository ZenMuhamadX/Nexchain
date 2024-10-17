import { leveldbState } from 'src/leveldb/state'
import { blockState } from './setState'

export const getBlockState = async (): Promise<blockState | undefined> => {
	const data: blockState = await leveldbState.get(`blockState`, {
		keyEncoding: 'utf8',
		valueEncoding: 'json',
	})
	if (data) {
		return data
	} else {
		return undefined
	}
}
