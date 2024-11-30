// import { getMyWalletAddress } from 'account/myWalletAddress'
// import { genTxData } from 'client/transfer/genTxData'
// import { sendTransactionToRpc } from 'client/transfer/sendTxToRpc'
// import { generateTimestampz } from 'nexchain/lib/generateTimestampz'

import { getAccount } from 'account/balance/getAccount'
import { getMyWalletAddress } from 'account/myWalletAddress'
import { genTxData } from 'client/transfer/genTxData'
import { sendTransactionToRpc } from 'client/transfer/sendTxToRpc'
import { createGenesisBlock } from 'nexchain/block/createGenesisBlock'
import { getHistoryByTxHash } from 'nexchain/block/query/onChain/Transaction/getHistoryByTx'
import { generateTimestampz } from 'nexchain/lib/generateTimestampz'

// const txData = genTxData({
// 	amount: 10,
// 	format: 'NXC',
// 	receiver: 'NxC720bc40cbeb3e5638c7205d63567f92b83b90ebd',
// 	sender: getMyWalletAddress(),
// 	timestamp: generateTimestampz(),
// 	fee: 5000,
// })
// sendTransactionToRpc(txData.data!)

getHistoryByTxHash(
	'TxCf23b0439e00328a7633d5d705556685858bad50b289a19d5020354afc33fee41',
	'json',
).then(console.log)
