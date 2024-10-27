import { structBalance } from 'interface/structBalance'
import { getBalance } from 'nexchain/account/balance/getBalance'
import { putBalance } from 'nexchain/account/balance/putBalance'
import { generateTimestampz } from 'nexchain/lib/generateTimestampz'

export const processReceiver = async (
	recieverAddress: string,
	amount: number,
) => {
	const oldData = await getBalance(recieverAddress).catch()
	if (!oldData) {
		const newData: structBalance = {
			address: recieverAddress,
			balance: amount,
			timesTransaction: 1,
			isContract: false,
			lastTransactionDate: generateTimestampz(),
			nonce: 1,
			decimal: 18,
			notes: '1^18 nexu = 1 NXC',
			symbol: 'nexu',
		}
		putBalance(recieverAddress, newData)
		return
	}
	const oldBalance = oldData?.balance as number
	const newData: structBalance = {
		address: recieverAddress,
		balance: oldBalance + amount,
		timesTransaction: oldData?.timesTransaction! + 1, // Mengupdate timesTransaction
		isContract: false,
		lastTransactionDate: generateTimestampz(),
		nonce: oldData.nonce + 1,
		decimal: 18,
		notes: '1^18 nexu = 1 NXC',
		symbol: 'nexu',
	}
	putBalance(recieverAddress, newData)
}
