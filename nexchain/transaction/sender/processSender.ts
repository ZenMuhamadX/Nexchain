import { structBalance } from 'interface/structBalance'
import { generateTimestampz } from 'nexchain/lib/generateTimestampz'
import { loggingErr } from 'logging/errorLog'
import { hasSufficientBalance } from 'nexchain/account/utils/hasSufficientBalance'
import { getPendingBalance } from '../getPendingBalance'
import { setPendingBalance } from '../setPendingBalance'
import { getAccount } from 'nexchain/account/balance/getAccount'
import { putAccount } from 'nexchain/account/balance/putAccount'

export const processSender = async (
	senderAddress: string,
	amount: number,
	fee: number,
) => {
	const balanceStatus = await hasSufficientBalance(senderAddress, amount, fee)
	if (!balanceStatus) {
		loggingErr({
			message: 'Insufficient balance',
			stack: new Error().stack!,
			hint: 'Insufficient balance',
			timestamp: generateTimestampz(),
			level: 'error',
			priority: 'high',
			context: 'leveldb processTransaction',
		})
		return
	}

	// Ambil data saldo saat ini
	const oldData = await getAccount(senderAddress)
	const calculateBalance = oldData?.balance! - amount
	const newData: structBalance = {
		address: senderAddress,
		balance: calculateBalance,
		transactionCount: oldData?.transactionCount! + 1,
		isContract: false,
		lastTransactionDate: generateTimestampz(),
		nonce: oldData!.nonce + 1,
		decimal: 18,
		notes: '1^18 nexu = 1 NXC',
		symbol: 'nexu',
	}
	await putAccount(senderAddress, newData)
	// Ambil dan perbarui pending balance
	const pendingBalance = await getPendingBalance(senderAddress)
	const updatedPendingAmount =
		(pendingBalance.pendingAmount || 0) - (amount + fee)
	await setPendingBalance({
		address: senderAddress,
		pendingAmount: Math.max(updatedPendingAmount, 0),
	})
}
