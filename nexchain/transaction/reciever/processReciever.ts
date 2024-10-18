import { structBalance } from 'nexchain/transaction/struct/structBalance'
import { getBalance } from 'nexchain/account/balance/getBalance'
import { putBalance } from 'nexchain/account/balance/putBalance'

export const processReciever = async (
	recieverAddress: string,
	amount: number,
) => {
	const transferAmount = amount
	const oldData = await getBalance(recieverAddress)
	if (!oldData) {
		const newData: structBalance = {
			address: recieverAddress,
			balance: transferAmount,
			timesTransaction: 0,
		}
		putBalance(recieverAddress, newData)
		return
	}
	const oldBalance = oldData?.balance as number
	const calculateBalance = oldBalance + transferAmount
	const newData: structBalance = {
		address: recieverAddress,
		balance: calculateBalance,
		timesTransaction: 0,
	}
	putBalance(recieverAddress, newData)
}
