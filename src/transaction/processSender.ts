import { structBalance } from "src/leveldb/struct/structBalance"
import { generateTimestampz } from "src/lib/timestamp/generateTimestampz"
import { loggingErr } from "src/logging/errorLog"
import { getBalance } from "src/wallet/balance/getBalance"
import { putBalance } from "src/wallet/balance/putBalance"
import { hasSufficientBalance } from "src/wallet/balance/utils/hasSufficientBalance"

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
