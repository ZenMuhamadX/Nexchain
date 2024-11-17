export type NXC = number
export type nexu = number

export interface contract {
	contractAddress: string
	owner: string
	balance: number
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
