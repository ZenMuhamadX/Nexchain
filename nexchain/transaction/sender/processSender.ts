import { structBalance } from 'nexchain/transaction/struct/structBalance'
import { generateTimestampz } from 'nexchain/lib/timestamp/generateTimestampz'
import { loggingErr } from 'logging/errorLog'
import { getBalance } from 'nexchain/account/balance/getBalance'
import { putBalance } from 'nexchain/account/balance/putBalance'
import { hasSufficientBalance } from 'nexchain/account/balance/utils/hasSufficientBalance'

export const processSender = async (
	senderAddress: string,
	amount: number,
	fee: number,
) => {
	const balanceStatus = await hasSufficientBalance(senderAddress, amount, fee!)
	if (!balanceStatus) {
		loggingErr({
			error: 'insufficient balance',
			stack: new Error().stack,
			hint: 'insufficient balance',
			time: generateTimestampz(),
			warning: null,
			context: 'leveldb processTransaction',
		})
		return
	}
	const transferAmount = amount
	const oldData = await getBalance(senderAddress)
	const newTimesTransaction = oldData?.timesTransaction! + 1
	const oldBalance = oldData?.balance as number
	const calculateBalance = oldBalance - transferAmount - fee!
	const newData: structBalance = {
		address: senderAddress,
		balance: calculateBalance,
		timesTransaction: newTimesTransaction,
	}
	putBalance(senderAddress, newData)
}
