import { chains } from 'src/block/initBlock'

export const getBlockByHash = (hash: string) => {
	const blockChains = chains.getChains()
	return blockChains.find((block) => block.block.header.hash === hash)
}
