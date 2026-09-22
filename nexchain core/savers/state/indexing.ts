import { rocksState } from 'nexchain core/db/state'

export const writeBlockHeight = async (
	blockHeight: number,
	blockHash: string,
) => {
	if (typeof blockHeight === 'bigint') {
		console.error('blockHeight must number')
		const convertedData = Number(blockHeight)
		blockHeight = convertedData
	}
	await rocksState.put(`blockHeight:${blockHeight}`, blockHash, {
		sync: false,
	})
}
