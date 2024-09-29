import { Buffer } from 'buffer'
import { Block } from '../../model/blocks/block'

export const structBlockReadyToHash = (block: Block): Buffer => {
	const newBlockStruct = {
		header: {
			previousHash: block.block.header.previousBlockHash,
			timestamp: block.block.header.timestamp,
			version: block.block.header.version,
		},
		height: block.block.height,
		signature: block.block.signature,
		transactions: block.block.transactions,
		merkleRoot: block.block.merkleRoot,
		networkId: block.block.networkId,
		size: block.block.size,
		status: 'confirmed',
		txCount: 0,
		validator: block.block.validator,
	}
	const stringBlock = JSON.stringify(newBlockStruct)
	return Buffer.from(stringBlock)
}
