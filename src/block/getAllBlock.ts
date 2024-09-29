import { Block } from 'src/model/blocks/block'
import { chains } from './initBlock'

export const getAllBlock = (parseMode: boolean = false): string | Block => {
	const allBlock = chains.getChains()
	if (!parseMode) {
		return JSON.stringify(allBlock)
	} else {
		return JSON.stringify(allBlock, null, 2)
	}
}
