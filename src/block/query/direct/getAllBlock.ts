import { Block } from 'src/model/blocks/block'
import { loadBlocks } from 'src/storage/loadBlock'

export const getAllBlock = (stringMode: boolean = false): string | Block[] => {
	const allBlock = loadBlocks() as Block[]
	if (!stringMode) {
		return allBlock
	} else {
		return JSON.stringify(allBlock, null, 2)
	}
}
