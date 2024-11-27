import { contract } from './structContract'

interface transaction {
	amount: number
	format: 'NXC'
	timestamp: number
}

export interface withdrawFromContract extends transaction {
	receiver: string
}

export interface transferToContract extends transaction {
	sender: string
}

export interface IManageContract {
	contractAddress: string
	getOwner(): Promise<string>
	getContractData(): Promise<contract>
	getContractBalance(): Promise<number>
	transferToContract(data: transferToContract): Promise<boolean>
	withdrawFromContract(data: withdrawFromContract): Promise<boolean>
}
