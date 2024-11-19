import { contract } from 'interface/structContract'
import { getContract } from '../../contract/utils/getContract'
import { processSender } from 'nexchain/transaction/sender/processSender'
import { hasSufficientBalance } from 'nexchain/account/utils/hasSufficientBalance'
import { saveContracts } from '../../contract/saveContract'
import { logToConsole } from 'logging/logging'

interface contractTransfer {
	contractAddress: string
	amount: number
	sender: string
	fee: number
}

export const transferToContract = async (
	data: contractTransfer,
): Promise<{ success: boolean }> => {
	logToConsole('Transferring to contract...')
	await processSender(data.sender, data.amount, data.fee)
	const hasSufficient = await hasSufficientBalance(
		data.sender,
		data.amount,
		data.fee,
	)
	if (!hasSufficient) {
		return { success: false }
	}
	const oldContract = await getContract(data.contractAddress)
	const newContractData: contract = {
		...oldContract,
		balance: oldContract.balance + data.amount,
	}
	saveContracts(newContractData)
	return { success: true }
}
