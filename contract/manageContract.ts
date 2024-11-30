import { contract } from 'interface/structContract'
import { getContract } from './utils/getContract'
import { logToConsole } from 'logging/logging'
import {
	transferToContract,
	withdrawFromContract,
} from 'interface/structManageContract'
import { TxInterface } from 'interface/structTx'
import { getHistoryByAddress } from 'nexchain/block/query/onChain/Transaction/getHistoryByAddress'
import { genTxData } from 'client/transfer/genTxData'
import { sendTransactionToRpc } from 'client/transfer/sendTxToRpc'

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

	public async transferToContract(data: transferToContract): Promise<boolean> {
		const txData = await genTxData({
			amount: data.amount,
			format: data.format,
			receiver: this.contractAddress,
			sender: data.sender,
			timestamp: data.timestamp,
			extraData: 'Transfer to contract',
			fee: 5000,
		})
		const success = await sendTransactionToRpc(txData.data!)
		if (!success) {
			logToConsole('Transfer failed')
			return false
		}
		return true
	}

	public async withdrawFromContract(
		data: withdrawFromContract,
	): Promise<boolean> {
		const txData = await genTxData({
			amount: data.amount,
			format: 'NXC',
			receiver: data.receiver,
			sender: this.contractAddress,
			timestamp: data.timestamp,
			extraData: 'Withdraw from contract',
			fee: 5000,
		})
		const success = await sendTransactionToRpc(txData.data!)
		if (!success) {
			logToConsole('Withdraw failed')
			return false
		}
		return true
	}

	public async getContractTransaction(
		enc: 'json' | 'hex',
	): Promise<{ history: TxInterface[]; count: number }> {
		return await getHistoryByAddress(this.contractAddress, enc)
	}
}
