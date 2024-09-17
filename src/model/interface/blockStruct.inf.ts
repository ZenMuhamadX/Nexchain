import { memPoolInterface } from './memPool.inf'
import { walletData } from './walletData.inf'

/**
 * Represents the structure of a block in the blockchain.
 */
export interface blockStruct {
	header: {
		previousHash: string // The hash of the previous block in the blockchain
		timestamp: string // The timestamp when the block was created
		hash: string // The hash of the current block
		nonce: string // A nonce value used in the mining process
		version: string // The version of the blockchain protocol
		difficulty: number // The difficulty level of the mining process
	}
	height: number // The height of the block in the blockchain
	signature: string // The digital signature for the block
	size: string // The size of the block
	walletData: walletData[] // List of wallet data associated with the block
	transactions: memPoolInterface[] // List of transactions included in the block
	reward: number // The reward for mining the block
}
