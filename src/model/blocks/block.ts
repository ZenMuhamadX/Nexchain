/** @format */
import { blockStruct } from '../interface/blockStruct.inf'
import { MemPoolInterface } from '../interface/memPool.inf'

// models/Block.ts
// This class represents a block in the blockchain
export class Block {
	public blk: blockStruct

	/**
	 * Constructor for the Block class
	 * @param height - The height of the block in the blockchain
	 * @param timestamp - The timestamp when the block was created
	 * @param transactions - List of transactions included in the block
	 * @param previousHash - The hash of the previous block in the blockchain
	 * @param hash - The hash of the current block
	 * @param signature - The digital signature for the block
	 * @param walletData - List of wallet data associated with the block
	 * @param blockSize - The size of the block
	 * @param nonce - A nonce value used in the mining process (optional)
	 */
	constructor(
		height: number,
		timestamp: string,
		transactions: MemPoolInterface[],
		previousHash: string,
		hash: string,
		signature: string,
		blockSize: string,
		nonce?: string,
	) {
		this.blk = {
			header: {
				previousHash: previousHash,
				timestamp: timestamp,
				hash: hash,
				nonce: nonce ?? '', // Use empty string if nonce is undefined
				version: '1.0.0',
				difficulty: 5,
			},
			height: height,
			signature: signature,
			size: blockSize,
			transactions,
			reward: 50,
		}
	}
}
