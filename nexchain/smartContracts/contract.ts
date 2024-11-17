import { toNexu } from 'nexchain/nexucoin/toNexu'
import { NXC, contract } from 'interface/structContract'
import { getContract } from './utils/getContract'
import { transferToContract } from './utils/transferToContract'
import { withdrawFromContract } from './utils/withdrawFromContract'

export class SmartContract {
	contractAddress: string
	constructor(contractAddr: string) {
		this.contractAddress = contractAddr
	}
	public async getOwner(): Promise<string> {
		return (await getContract(this.contractAddress)).owner
	}

	public async getContractData(): Promise<contract> {
		return await getContract(this.contractAddress)
	}

	public async getContractBalance(): Promise<number> {
		return (await getContract(this.contractAddress)).balance
	}

	public async transferToContract(
		amount: NXC,
		sender: string,
	): Promise<boolean> {
		console.info('Transferring to contract...')
		const success = await transferToContract({
			amount,
			contractAddress: this.contractAddress,
			sender,
		})
		if (!success) {
			console.info('Transfer failed')
			return false
		}
		console.info('Transfer success')
		return true
	}

	public async withdrawFromContract(
		contractAddress: string,
		amount: NXC,
		receiver: string,
	): Promise<void> {
		await withdrawFromContract(
			contractAddress,
			toNexu(amount),
			receiver,
			toNexu(0.05),
		)
	}
}
