import { loggingErr } from 'logging/errorLog'
import { getBalance } from '../balance/getBalance'
import { generateTimestampz } from 'nexchain/lib/generateTimestampz'
import { logToConsole } from 'logging/logging'
import { isContract } from 'nexchain/lib/isContract'
import { ManageContract } from 'nexchain/contract/contract'

export const hasSufficientBalance = async (
	address: string,
	amount: number,
	fee: number,
): Promise<boolean | undefined> => {
	if (!address) {
		logToConsole('Address not provided')
		return false
	}

	try {
		if (isContract(address)) {
			const contract = new ManageContract(address)
			const balance = await contract.getContractBalance()
			if (balance >= amount + fee) {
				return true
			} else {
				console.error('Insufficient balance')
				return false
			}
		}
		const balance = await getBalance(address)
		if (!balance) {
			console.error('Balance not found')
			return false
		}
		if (balance.balance >= amount + fee) {
			return true
		} else {
			console.error('Insufficient balance')
			return false
		}
	} catch (error) {
		loggingErr({
			context: 'hasSufficientBalance',
			message: 'Balance has not sufficient',
			stack: new Error().stack!,
			timestamp: generateTimestampz(),
			level: 'error',
			priority: 'high',
		})
		return undefined
	}
}
