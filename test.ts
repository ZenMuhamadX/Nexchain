import { getMyWalletAddress } from 'account/myWalletAddress'
import { createTransaction } from 'client/lib/createTransaction'
import { sendTransactionToRpc } from 'client/transfer/sendTxToRpc'
import { generateTimestampz } from 'nexchain/lib/generateTimestampz'
const txData = createTransaction({
	amount: 10,
	fee: 5000,
	format: 'NXC',
	receiver: 'NxC720bc40cbeb3e5638c7205d63567f92b83b90ebd',
	sender: getMyWalletAddress(),
	timestamp: generateTimestampz(),
	extraMessage: '',
})
sendTransactionToRpc(txData.rawData!).then(console.log)
