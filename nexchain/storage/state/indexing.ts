import { rocksState } from 'nexchain/rocksdb/state'

export const writeBlockHeight = (blockHeight: number, blockHash: string) => {
	rocksState.put(`blockHeight:${blockHeight}`, blockHash, {
		sync: true,
	})
}
