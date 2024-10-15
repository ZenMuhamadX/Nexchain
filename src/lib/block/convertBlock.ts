import { Buffer } from 'buffer'
import { Block } from '../../model/blocks/block'

export const structBlockReadyToHash = (block: Block): Buffer => {
	const newBlockStruct = {
		prevBlockHash: block.block.header.previousBlockHash,
		merkleRoot: block.block.merkleRoot,
		timestamp: block.block.header.timestamp,
		height: block.block.height,
		difficulty: block.block.header.difficulty,
		totalTransactionFees: block.block.totalTransactionFees,
		version: block.block.header.version,
		hashingAlgorithm: block.block.header.hashingAlgorithm,
	}
	const stringBlock = JSON.stringify(newBlockStruct)
	return Buffer.from(stringBlock)
}
