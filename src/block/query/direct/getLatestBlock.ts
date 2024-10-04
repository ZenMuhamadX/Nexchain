import { getLastBlockNumber } from 'src/lib/utils/getLatestBlockNum'
import { Block } from 'src/model/blocks/block'
import { loadBlocks } from 'src/storage/loadBlock'

export const getLatestBlock = (stringMode: boolean = false): string | Block => {
	const latestBlock = loadBlocks() as Block[]
	if (!stringMode) {
		return latestBlock[getLastBlockNumber() - 1]
	} else {
		return JSON.stringify(latestBlock[getLastBlockNumber() - 1], null, 2)
	}
}
