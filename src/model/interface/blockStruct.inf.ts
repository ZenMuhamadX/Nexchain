import { memPoolBlock } from '../blocks/memPoolBlock'
import { memPoolInterface } from './memPool.inf'
import { walletData } from './walletData.inf'

export interface blockStruct {
	header: {
		previousHash: string
		timestamp: string
		hash: string
		nonce: number
		version: string
	}
	height: number
	signature: string
	size: string
	walletData: walletData[]
	transactions: memPoolInterface[] | memPoolBlock[]
	reward: number
}
