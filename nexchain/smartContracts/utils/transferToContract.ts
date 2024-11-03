import { contract } from 'interface/structContract'
import { getContract } from './getContract'
import { processSender } from 'nexchain/transaction/sender/processSender'
import { toNexu } from 'nexchain/nexucoin/toNexu'
import { hasSufficientBalance } from 'nexchain/account/utils/hasSufficientBalance'
import { saveContracts } from '../saveContract'

interface contractTransfer {
	contractAddress: string
	amount: number
	sender: string
}
export const transferToContract = async (
	data: contractTransfer,
): Promise<boolean> => {
	await processSender(data.sender, data.amount, toNexu(0.05))
	const hasSufficient = await hasSufficientBalance(
		data.sender,
		data.amount,
		toNexu(0.05),
	)
	if (!hasSufficient) {
		return false
	}
	const oldContract = await getContract(data.contractAddress)
	const newContractData: contract = {
		...oldContract,
		balance: oldContract.balance + data.amount,
	}
	saveContracts(newContractData)
	return true
}
