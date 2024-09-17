import { Buffer } from 'buffer'
import { Block } from '../../model/blocks/block'

export const blockReadyToHash = (block: Block): Buffer => {
	const newBlockStruct = {
		header: {
			previousHash: block.blk.header.previousHash,
			timestamp: block.blk.header.timestamp,
			version: block.blk.header.version,
		},
		walletData: block.blk.walletData,
		transactions: block.blk.transactions,
	}
	const stringBlock = JSON.stringify(newBlockStruct)
	return Buffer.from(stringBlock)
}
