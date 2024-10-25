import { coinBaseTx } from './structCoinBaseTx'
import { header } from './structHeader'
import { metadata } from './structMetadata'
import { TxInterface } from './structTx'

export type HexString = `0x${string}`

export interface blockStruct {
	header: header
	height: number
	signature: string
	size: number
	totalTransactionFees: number // Optional field to store the total transaction fees in the block
	merkleRoot: string
	networkId: string
	status: 'confirmed' | 'pending'
	blockReward: number
	totalReward: number
	coinbaseTransaction: coinBaseTx
	metadata?: metadata
	transactions: TxInterface[]
}
