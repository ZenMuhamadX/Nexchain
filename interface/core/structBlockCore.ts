import { structCoinBaseTxCore } from './structCoinBaseTxCore'
import { contract } from '../front/structContract'
import { header } from '../common/structHeader'
import { metadata } from '../common/structMetadata'
import { TxInterfaceCore } from './TxInterfaceCore'

export interface structBlockCore {
	header: header
	height: number
	size: number
	totalTransactionFees: bigint // Optional field to store the total transaction fees in the block
	merkleRoot: string
	minerId: string
	chainId?: number
	status: 'confirmed' | 'pending'
	blockReward: bigint
	totalReward: bigint
	sign: {
		v: number
		r: string
		s: string
	}
	coinbaseTransaction: structCoinBaseTxCore
	metadata?: metadata
	transactions: TxInterfaceCore[]
	contract?: contract[]
}
