import { generateTimestampz } from 'nexchain core/lib/generateTimestampz'
import { loggingErr } from 'logging/errorLog'
import { setPendingBalance } from '../../savers/transaction/setPendingBalance'
import { hasSufficientBalance } from 'account/utils/hasSufficientBalance'
import { loadAccountCore } from 'nexchain core/loaders/loadAccountCore'
import { structBalanceCore } from 'interface/core/structBalanceCore'
import { putAccountCore } from 'nexchain core/savers/account/putAccountCore'
import { loadPendingBalanceCore } from 'nexchain core/loaders/loadPendingBalanceCore'

export const processSender = async (
	senderAddress: string,
	amount: bigint,
	fee: bigint,
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
	const oldData = await loadAccountCore(senderAddress)
	// eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
	const calculateBalance = oldData?.balance! - amount
	const newData: structBalanceCore = {
		address: senderAddress,
		balance: calculateBalance,
		// eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
		transactionCount: oldData?.transactionCount! + 1,
		isContract: false,
		lastTransactionDate: generateTimestampz(),
		nonce: oldData!.nonce + 1,
	}
	await putAccountCore(senderAddress, newData)
	// Ambil dan perbarui pending balance
	const pendingBalance = await loadPendingBalanceCore(senderAddress)
	const updatedPendingAmount =
		(pendingBalance.pendingAmount || 0n) - (amount + fee)
	await setPendingBalance({
		address: senderAddress,
		pendingAmount: updatedPendingAmount,
	})
}
