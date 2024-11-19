import { toNexu } from 'nexchain/nexucoin/toNexu'
import { NXC, contract } from 'interface/structContract'
import { getContract } from './utils/getContract'
import { withdrawFromContract } from '../transaction/contract/withdrawFromContract'
import { transferFunds } from 'nexchain/transaction/transferFunds'
import { generateTimestampz } from 'nexchain/lib/generateTimestampz'
import { logToConsole } from 'logging/logging'

export class ManageContract {
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
		const success = await transferFunds({
			amount,
			format: 'NXC',
			receiver: this.contractAddress,
			sender,
			timestamp: generateTimestampz(),
			extraData: 'Transfer to contract',
			fee: 5000,
		})
		if (!success) {
			logToConsole('Transfer failed')
			return false
		}
		return true
	}

	public async withdrawFromContract(
		amount: NXC,
		receiver: string,
	): Promise<void> {
		await withdrawFromContract(
			this.contractAddress,
			toNexu(amount),
			receiver,
			5000,
		)
	}
}
