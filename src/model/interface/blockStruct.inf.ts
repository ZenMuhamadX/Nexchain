import { MemPoolInterface } from './memPool.inf'

export interface blockStruct {
	header: {
		previousBlockHash: string
		timestamp: number // Changed to number for better efficiency (UNIX timestamp)
		hash: string
		nonce: string
		version: string
		difficulty: number
		hashingAlgorithm: string // Optional, in case you want flexibility in hashing algorithms
	}
	height: number
	signature: string
	size: number
	totalTransactionFees: number // Optional field to store the total transaction fees in the block
	merkleRoot: string
	networkId: string
	status: 'confirmed' | 'pending'
	blockReward: number
	coinbaseTransaction: {
		to: string
		amount: number
		reward: number
	}
	validator: {
		rewardAddress: string
		stakeAmount: number // Optional, if you're planning to implement a proof-of-stake system
		validationTime: number // Optional, for storing the time taken to validate the block
	}
	metadata?: {
		txCount: number
		gasPrice: number
		created_at: number // Changed to number (UNIX timestamp) for consistency
		notes: any
	}
	transactions: MemPoolInterface[]
}
