import { getAccount } from 'account/balance/getAccount'
import { putAccount } from 'account/balance/putAccount'
import { structBalance } from 'interface/structBalance'
import { nexu } from 'interface/structContract'
import { generateTimestampz } from 'nexchain/lib/generateTimestampz'

export const processReceiver = async (
	recieverAddress: string,
	amount: nexu,
) => {
	const oldData = await getAccount(recieverAddress).catch()
	if (!oldData) {
		const newData: structBalance = {
			address: recieverAddress,
			balance: amount,
			transactionCount: 1,
			isContract: false,
			lastTransactionDate: generateTimestampz(),
			nonce: 1,
		}
		await putAccount(recieverAddress, newData)
		return
	}
	const oldBalance = oldData?.balance as number
	const newData: structBalance = {
		address: recieverAddress,
		balance: oldBalance + amount,
		transactionCount: oldData?.transactionCount! + 1, // Mengupdate timesTransaction
		isContract: false,
		lastTransactionDate: generateTimestampz(),
		nonce: oldData.nonce + 1,
	}
	await putAccount(recieverAddress, newData)
}
