/** @format */
import { blockStruct } from '../../../interface/structBlock'

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
				hashingAlgorithm: blockData.header.hashingAlgorithm,
			},
			height: blockData.height,
			signature: blockData.signature,
			size: blockData.size,
			merkleRoot: blockData.merkleRoot,
			networkId: blockData.networkId,
			blockReward: blockData.blockReward,
			totalReward: blockData.totalReward,
			status: blockData.status,
			totalTransactionFees: blockData.totalTransactionFees!,
			coinbaseTransaction: blockData.coinbaseTransaction,
			metadata: blockData.metadata!,
			transactions: blockData.transactions,
		}
	}
}
