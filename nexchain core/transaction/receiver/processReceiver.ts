import { getAccount } from 'libAccount/balance/getAccount'
import { putAccountCore } from 'nexchain core/savers/account/putAccountCore'
import { generateTimestampz } from 'nexchain core/lib/generateTimestampz'
import { structBalanceCore } from 'interface/core/structBalanceCore'
import { stringToBigInt } from 'nexchain core/loaders/lib/stringToBigint'

export const processReceiver = async (
	recieverAddress: string,
	amount: bigint,
) => {
	const oldData = await getAccount(recieverAddress).catch()
	const convertedOldData = stringToBigInt(oldData) as structBalanceCore
	if (!oldData) {
		const newData: structBalanceCore = {
			address: recieverAddress,
			balance: amount,
			transactionCount: 1,
			isContract: false,
			lastTransactionDate: generateTimestampz(),
			nonce: 1,
		}
		await putAccountCore(recieverAddress, newData)
		return
	}
	const oldBalance = convertedOldData?.balance
	const newData: structBalanceCore = {
		address: recieverAddress,
		balance: oldBalance + amount,
		transactionCount: convertedOldData?.transactionCount + 1, // Mengupdate timesTransaction
		isContract: false,
		lastTransactionDate: generateTimestampz(),
		nonce: oldData.nonce + 1,
	}
	await putAccountCore(recieverAddress, newData)
}
