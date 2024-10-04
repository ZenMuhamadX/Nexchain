import { Block } from 'src/model/blocks/block'
import { loadBlocks } from 'src/storage/loadBlock'

export const getBlockByHeight = (height: number): Block | undefined => {
	const blockChains = loadBlocks() as Block[]
	return blockChains.find((block) => block.block.height === height)
}
