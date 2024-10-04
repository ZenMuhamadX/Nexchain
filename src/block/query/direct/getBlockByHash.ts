import { Block } from 'src/model/blocks/block'
import { loadBlocks } from 'src/storage/loadBlock'

export const getBlockByHash = (hash: string) => {
	const blockChains = loadBlocks() as Block[]
	return blockChains.find((block) => block.block.header.hash === hash)
}
