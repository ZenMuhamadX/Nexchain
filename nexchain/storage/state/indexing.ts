import { rocksState } from 'nexchain/rocksdb/state'

export const writeBlockHeight = async (
	blockHeight: number,
	blockHash: string,
) => {
	await rocksState.put(`blockHeight:${blockHeight}`, blockHash, {
		sync: false,
	})
}
