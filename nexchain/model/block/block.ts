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
			size: blockData.size,
			merkleRoot: blockData.merkleRoot,
			minerId: blockData.minerId,
			chainId: 26,
			blockReward: blockData.blockReward,
			totalReward: blockData.totalReward,
			status: blockData.status,
			totalTransactionFees: blockData.totalTransactionFees!,
			sign: blockData.sign,
			coinbaseTransaction: blockData.coinbaseTransaction,
			metadata: blockData.metadata!,
			transactions: blockData.transactions,
		}
	}
}
