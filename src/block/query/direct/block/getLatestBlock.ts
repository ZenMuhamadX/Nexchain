import { Block } from 'src/model/blocks/block'
import { getAllBlock } from './getAllBlock'

export const getLatestBlock = async (
	stringMode: boolean = false,
): Promise<string | Block> => {
	const allBlock = await getAllBlock()
	const latestBlock = allBlock[allBlock.length - 1]
	if (stringMode) return JSON.stringify(latestBlock)
	return latestBlock
}
