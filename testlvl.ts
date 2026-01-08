import { jsonRpcRequest } from 'client/rpc-client/rpcManage'
import { createGenesisBlock } from 'nexchain/block/createGenesisBlock'
import { getCurrentBlock } from 'nexchain/block/query/onChain/block/getCurrentBlock'
import { generateTimestampz } from 'nexchain/lib/generateTimestampz'
import { mineBlock } from 'nexchain/miner/mining'

const rpc = new jsonRpcRequest()
// rpc
// 	.getTransactionsByAddress('NxCeae0aadeb2604e2e7c4044677e45bb6ae059dc7a')
// 	.then(console.log)
// createGenesisBlock().then(console.log)
// getCurrentBlock('json').then(console.log)
// rpc.getBalance('NxCeae0aadeb2604e2e7c4044677e45bb6ae059dc7a').then(console.log)
rpc.sendTransaction({
	amount: 10000,
	format: 'nexu',
	fee: 10,
	receiver: 'NxCd47082c0fa0911288043cfb4457043696cd44f2e',
	sender: 'NxCeae0aadeb2604e2e7c4044677e45bb6ae059dc7a',
	timestamp: generateTimestampz(),
})
// mineBlock('NxCeae0aadeb2604e2e7c4044677e45bb6ae059dc7a')
