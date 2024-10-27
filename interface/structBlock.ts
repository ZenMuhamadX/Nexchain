import { coinBaseTx } from './structCoinBaseTx'
import { header } from './structHeader'
import { metadata } from './structMetadata'
import { TxInterface } from './structTx'

export type HexString = `0x${string}`

export interface blockStruct {
	header: header
	height: number
	size: number
	totalTransactionFees: number // Optional field to store the total transaction fees in the block
	merkleRoot: string
	minerId: string
	chainId?: number
	status: 'confirmed' | 'pending'
	blockReward: number
	totalReward: number
	sign: {
		v: number
		r: string
		s: string
	}
	coinbaseTransaction: coinBaseTx
	metadata?: metadata
	transactions: TxInterface[]
}
