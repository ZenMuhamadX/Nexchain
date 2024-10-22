import { structBalance } from 'interface/structBalance'
import { getBalance } from 'nexchain/account/balance/getBalance'
import { putBalance } from 'nexchain/account/balance/putBalance'
import { generateTimestampz } from 'nexchain/lib/timestamp/generateTimestampz'

export const processReciever = async (
	recieverAddress: string,
	amount: number,
) => {
	const transferAmount = amount
	const oldData = await getBalance(recieverAddress).catch(() => null)
	if (!oldData) {
		const newData: structBalance = {
			address: recieverAddress,
			balance: transferAmount,
			timesTransaction: 1,
			isContract: false,
			lastTransactionDate: generateTimestampz(),
			nonce: 1,
		}
		putBalance(recieverAddress, newData)
		return
	}
	const oldBalance = oldData?.balance as number
	const calculateBalance = oldBalance + transferAmount
	const newData: structBalance = {
		address: recieverAddress,
		balance: calculateBalance,
		timesTransaction: oldData?.timesTransaction! + 1, // Mengupdate timesTransaction
		isContract: false,
		lastTransactionDate: generateTimestampz(),
		nonce: oldData.nonce + 1,
	}
	putBalance(recieverAddress, newData)
}
