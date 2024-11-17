import { NXC } from 'interface/structContract'
import { processReceiver } from 'nexchain/transaction/receiver/processReceiver'
import { getContract } from '../../smartContracts/utils/getContract'
import { saveContracts } from '../../smartContracts/saveContract'

export const withdrawFromContract = async (
	contractAddress: string,
	amount: NXC,
	receiver: string,
	fee: NXC, // Tambahkan parameter fee
) => {
	const contract = await getContract(contractAddress)
	const totalAmount = amount + fee // Total yang dibutuhkan termasuk fee

	if (contract.balance < totalAmount) {
		throw new Error(
			'Contract balance is not enough for the requested amount and gas fee.',
		)
	}
	await processReceiver(receiver, amount)

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
