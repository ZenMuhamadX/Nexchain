import { Block } from 'src/model/blocks/block'
import { chains } from '../../initBlock'

export const getLatestBlock = (parseMode: boolean = false): string | Block => {
	const latestBlock = chains.getLatestBlock()
	if (!parseMode) {
		return JSON.stringify(latestBlock)
	} else {
		return JSON.stringify(latestBlock, null, 2)
	}
}
