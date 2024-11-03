import { structBalance } from 'interface/structBalance'
import { generateTimestampz } from 'nexchain/lib/generateTimestampz'
import { loggingErr } from 'logging/errorLog'
import { getBalance } from 'nexchain/account/balance/getBalance'
import { putBalance } from 'nexchain/account/balance/putBalance'
import { hasSufficientBalance } from 'nexchain/account/utils/hasSufficientBalance'
import { getPendingBalance } from '../getPendingBalance'
import { setPendingBalance } from '../setPendingBalancet'
import { burnNexu } from '../burnNexu'

export const processSender = async (
	senderAddress: string,
	amount: number,
	fee: number,
) => {
	const balanceStatus = await hasSufficientBalance(senderAddress, amount, fee)
	if (!balanceStatus) {
		loggingErr({
			error: 'Insufficient balance',
			stack: new Error().stack,
			hint: 'Insufficient balance',
			time: generateTimestampz(),
			warning: null,
			context: 'leveldb processTransaction',
		})
		return
	}

	// Ambil data saldo saat ini
	const oldData = await getBalance(senderAddress)
	const calculateBalance = oldData?.balance! - amount
	const newData: structBalance = {
		address: senderAddress,
		balance: calculateBalance,
		timesTransaction: oldData?.timesTransaction! + 1,
		isContract: false,
		lastTransactionDate: generateTimestampz(),
		nonce: oldData!.nonce + 1,
		decimal: 18,
		notes: '1^18 nexu = 1 NXC',
		symbol: 'nexu',
	}
	await putBalance(senderAddress, newData)
	await burnNexu(senderAddress, fee)
	// Ambil dan perbarui pending balance
	const pendingBalance = await getPendingBalance(senderAddress)
	const updatedPendingAmount =
		(pendingBalance.pendingAmount || 0) - (amount + fee)
	await setPendingBalance({
		address: senderAddress,
		pendingAmount: Math.max(updatedPendingAmount, 0),
	})
}
