import { NXC } from 'interface/structContract'
import { processReceiver } from 'nexchain/transaction/receiver/processReceiver'
import { getContract } from './getContract'
import { saveContracts } from '../saveContract'

interface WithdrawParams {
	contractAddress: string
	amount: NXC
	receiver: string
	fee: NXC
}

export const withdrawFromContract = async (data: WithdrawParams) => {
	const contract = await getContract(data.contractAddress)
	const totalAmount = data.amount + data.fee // Total yang dibutuhkan termasuk fee

	if (contract.balance < totalAmount) {
		throw new Error(
			'Contract balance is not enough for the requested amount and gas fee.',
		)
	}
	await processReceiver(data.receiver, data.amount)

	// Kurangi balance kontrak dengan totalAmount
	await saveContracts({
		contractAddress: contract.contractAddress,
		deployedAt: contract.deployedAt,
		owner: contract.owner,
		deploymentTransactionHash: contract.deploymentTransactionHash,
		status: contract.status,
		balance: contract.balance - totalAmount,
		currency: 'nexu',
	})
}
