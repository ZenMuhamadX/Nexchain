import { contract } from 'interface/front/structContract'
import { getContract } from './utils/getContract'
import { logToConsole } from 'logging/logging'
import {
	transferToContract,
	withdrawFromContract,
} from 'interface/front/structManageContract'
import { getHistoryByAddress } from 'nexchain core/block/query/onChain/Transaction/getHistoryByAddress'
import { sendTransactionToRpc } from 'client/rpc-client/controller/POST/sendTxToRpc'
import { createTransaction } from 'client/lib/createTransaction'
import { bigIntToString } from 'nexchain core/savers/lib/bigintToString'
import { stringToBigInt } from 'nexchain core/loaders/lib/stringToBigint'
import { TxInterfaceFront } from 'interface/front/TxinterfaceFront'

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

	public async getContractBalance(): Promise<string> {
		return bigIntToString(await getContract(this.contractAddress))
			.balance as string
	}

	public async transferToContract(data: transferToContract): Promise<boolean> {
		const convertedData = stringToBigInt(data)
		const txData = createTransaction({
			amount: convertedData.amount,
			format: convertedData.format,
			receiver: this.contractAddress,
			sender: convertedData.sender,
			timestamp: convertedData.timestamp,
			extraMessage: 'Transfer to contract',
			fee: 5000n,
		})
		const success = await sendTransactionToRpc(txData.rawData!)
		if (!success) {
			logToConsole('Transfer failed')
			return false
		}
		return true
	}

	public async withdrawFromContract(
		data: withdrawFromContract,
	): Promise<boolean> {
		const convertedData = stringToBigInt(data)
		const txData = createTransaction({
			amount: convertedData.amount,
			format: 'NXC',
			receiver: convertedData.receiver,
			sender: this.contractAddress,
			timestamp: convertedData.timestamp,
			extraMessage: 'Withdraw from contract',
			fee: 5000n,
		})
		const success = await sendTransactionToRpc(txData.rawData!)
		if (!success) {
			logToConsole('Withdraw failed')
			return false
		}
		return true
	}

	public async getContractTransaction(
		enc: 'json' | 'hex',
	): Promise<{ history: TxInterfaceFront[]; count: number }> {
		return await getHistoryByAddress(this.contractAddress, enc)
	}
}
