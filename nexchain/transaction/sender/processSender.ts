import { structBalance } from 'nexchain/transaction/struct/structBalance'
import { generateTimestampz } from 'nexchain/lib/timestamp/generateTimestampz'
import { loggingErr } from 'logging/errorLog'
import { getBalance } from 'nexchain/account/balance/getBalance'
import { putBalance } from 'nexchain/account/balance/putBalance'
import { hasSufficientBalance } from 'nexchain/account/utils/hasSufficientBalance'

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
	const oldData = await getBalance(senderAddress)
	const calculateBalance = oldData?.balance! - amount - fee!
	const newData: structBalance = {
		address: senderAddress,
		balance: calculateBalance,
		timesTransaction: oldData?.timesTransaction! + 1,
		isContract: false,
		lastTransactionDate: generateTimestampz(),
		nonce: oldData!.nonce + 1,
	}
	putBalance(senderAddress, newData)
}
