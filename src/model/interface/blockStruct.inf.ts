import { memPoolInterface } from './memPool.inf'
import { walletData } from './walletData.inf'

export interface blockStruct {
	header: {
		previousHash: string
		timestamp: string
		hash: string
		nonce: string
		version: string
		difficulty: number
	}
	height: number
	signature: string
	size: string
	walletData: walletData[]
	transactions: memPoolInterface[] | memPoolInterface[]
	reward: number
}
