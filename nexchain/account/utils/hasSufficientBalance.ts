import { loggingErr } from 'logging/errorLog'
import { getBalance } from '../balance/getBalance'
import { generateTimestampz } from 'nexchain/lib/generateTimestampz'

export const hasSufficientBalance = async (
	address: string,
	amount: number,
	fee: number,
): Promise<boolean | undefined> => {
	if (!address) {
		console.info('Address not provided')
		return false
	}

	try {
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
			error: error,
			stack: new Error().stack,
			time: generateTimestampz(),
			hint: '',
			warning: '',
		})
		return undefined
	}
}
