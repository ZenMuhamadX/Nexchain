/** @format */
import { blockStruct } from '../interface/blockStruct.inf'
import { memPoolInterface } from '../interface/memPool.inf'
import { walletData } from '../interface/walletData.inf'

// models/Block.ts
// Kelas ini merepresentasikan blok dalam blockchain
export class Block {
	public blk: blockStruct

	// Konstruktor untuk kelas Block
	constructor(
		height: number,
		timestamp: string,
		transactions: memPoolInterface[],
		previousHash: string,
		hash: string,
		signature: string,
		walletData: walletData[],
		blockSize: string,
		nonce?: string,
	) {
		this.blk = {
			header: {
				previousHash: previousHash,
				timestamp: timestamp,
				hash: hash,
				nonce: nonce as string,
				version: '1.0.0',
				difficulty: 5,
			},
			height: height,
			signature: signature,
			size: blockSize,
			walletData: walletData,
			transactions,
			reward: 50,
		}
	}
}
