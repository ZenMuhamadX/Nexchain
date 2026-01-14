export interface contract {
	contractAddress: string
	owner: string
	balance: bigint
	contractCodeHash?: string
	deploymentTransactionHash: string
	deployedAt: number
	status: 'active' | 'inactive'
	metadata?: {
		name: string
		version: string
	}
	currency: 'nexu'
}
