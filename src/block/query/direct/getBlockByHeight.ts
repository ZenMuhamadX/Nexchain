import { chains } from 'src/block/initBlock'
import { Block } from 'src/model/blocks/block'

export const getBlockByHeight = (height: number): Block | undefined => {
	const blockChains = chains.getChains()
	return blockChains.find((block) => block.block.height === height)
}
