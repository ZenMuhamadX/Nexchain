import { leveldbState } from 'nexchain/leveldb/state'

export const writeBlockHeight = (blockHeight: number, blockHash: string) => {
	leveldbState.put(`blockHeight:${blockHeight}`, blockHash, {
		sync: true,
	})
}
