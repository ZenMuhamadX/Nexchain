/** @format */
import { blockStruct } from '../interface/blockStruct.inf'

// models/Block.ts
// This class represents a block in the blockchain
export class Block {
	public block: blockStruct
	constructor(blockData: blockStruct) {
		this.block = {
			header: {
				previousBlockHash: blockData.header.previousBlockHash,
				timestamp: blockData.header.timestamp,
				hash: blockData.header.hash,
				nonce: blockData.header.nonce!, // Use empty string if nonce is undefined
				version: '1.0.0',
				difficulty: 5,
			},
			height: blockData.height,
			signature: blockData.signature,
			size: blockData.size,
			transactions: blockData.transactions,
			gasUsed: blockData.gasUsed,
			merkleRoot: blockData.merkleRoot,
			networkId: blockData.networkId,
			status: blockData.status,
			totalTransactionFees: blockData.totalTransactionFees!,
			coinbaseTransaction: blockData.coinbaseTransaction,
			validator: blockData.validator,
			metadata: blockData.metadata!,
		}
	}
}
