import { loggingErr } from 'src/logging/errorLog'
import { getBalance } from '../getBalance'
import { generateTimestampz } from 'src/lib/timestamp/generateTimestampz'

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

		if (balance === undefined) {
			console.info('Address not found')
			return false
		}

		if (amount < 0) {
			console.info('Amount must be a positive number')
			return false
		}

		if (fee < 0) {
			console.info('Fee must be a non-negative number')
			return false
		}

		if (balance.balance >= amount + fee) {
			return true
		} else {
			console.info('Insufficient balance')
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
