import { Block } from '../model/block/block'

export const prepareBlockForHashing = ({ block }: Block): string => {
	const newBlockStruct = {
		previousBlockHash: block.header.previousBlockHash,
		timestamp: block.header.timestamp,
		version: block.header.version,
		hashingAlgorithm: block.header.hashingAlgorithm,
		height: block.height,
		merkleRoot: block.merkleRoot,
		chainId: block.chainId,
		status: block.status,
		blockReward: block.blockReward,
		transactions: block.transactions,
	}
	return JSON.stringify(newBlockStruct)
}
