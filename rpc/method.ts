import { JSONRPCServer } from 'json-rpc-2.0'
import { toNxc } from 'nexchain core/nexucoin/toNxc'
import { getBlockByHash } from 'nexchain core/block/query/onChain/block/getBlockByHash'
import { getBlockByHeight } from 'nexchain core/block/query/onChain/block/getBlockByHeight'
import { getBlockState } from 'nexchain core/storage/state/getState'
import { getCurrentBlock } from 'nexchain core/block/query/onChain/block/getCurrentBlock'
import { structBalance } from 'interface/structBalance'
import { getHistoryByTxHash } from 'nexchain core/block/query/onChain/Transaction/getHistoryByTxHash'
import { getHistoryByAddress } from 'nexchain core/block/query/onChain/Transaction/getHistoryByAddress'
import { Block } from 'nexchain core/model/block/block'
import { getAccount } from 'account/balance/getAccount'
import { addTxToMempool } from 'nexchain core/transaction/addTxToMempool'
import { TxInterface } from 'interface/structTx'
import { decodeTx } from 'nexchain core/hex/tx/decodeTx'
import { ManageContract } from 'contract/manageContract'
import { getPendingBalance } from 'nexchain core/transaction/getPendingBalance'
import { createNewWalletAddress } from 'account/createNewWallet'
import { stringToHex } from 'nexchain core/hex/stringToHex'

const rpc = new JSONRPCServer()

rpc.addMethod('echo', (message: any) => {
	return message
})

// Block

rpc.addMethod('nex_getBlockByHash', async (hash: string): Promise<any> => {
	return await getBlockByHash(hash!, 'hex')
})

rpc.addMethod('nex_getBlockByHeight', async (blockNumber: number) => {
	return await getBlockByHeight(blockNumber!, 'hex')
})

rpc.addMethod('nex_getBlockTransactionByHeight', async (height: number) => {
	const block = (await getBlockByHeight(height, 'json')) as Block
	return block.block.transactions.length
})

rpc.addMethod('nex_getBlockTransactionByHash', async (hash: string) => {
	const block = (await getBlockByHash(hash, 'json')) as Block
	return block.block.transactions.length
})

rpc.addMethod('nex_getBlockState', async () => {
	return stringToHex(JSON.stringify(await getBlockState()))
})

rpc.addMethod('nex_getCurrentBlock', async () => {
	return await getCurrentBlock('hex')
})

rpc.addMethod('nex_getChainId', async () => {
	return 26
})

// Account

rpc.addMethod('nex_getPendingBalance', async (address: string) => {
	return stringToHex(JSON.stringify(await getPendingBalance(address)))
})

rpc.addMethod('nex_getAccount', async (address: string) => {
	return stringToHex(JSON.stringify(await getAccount(address)))
})

rpc.addMethod('nex_getContractBalance', async (address: string) => {
	return stringToHex(
		JSON.stringify(await new ManageContract(address).getContractBalance()),
	)
})

rpc.addMethod('nex_getBalance', async (address: string) => {
	const balance = await getAccount(address)
	return stringToHex(`${toNxc(balance?.balance!).toFixed(18)} NXC`)
})

rpc.addMethod('nex_getNonceAccount', async (address: string) => {
	const account = await getAccount(address)
	return stringToHex(JSON.stringify(account?.nonce))
})

// Transaction

rpc.addMethod('nex_getTransactionCount', async (address: string) => {
	const account = (await getAccount(address)) as structBalance
	return stringToHex(JSON.stringify(account?.transactionCount!))
})

rpc.addMethod('nex_getTransactionByTxHash', async (txHash: string) => {
	return await getHistoryByTxHash(txHash, 'hex')
})

rpc.addMethod('nex_getTransactionsByAddress', async (address: string) => {
	return await getHistoryByAddress(address, 'hex')
})

rpc.addMethod('nex_sendTransaction', async (data: string) => {
	const decodedData: TxInterface = decodeTx(data)
	return await addTxToMempool(decodedData)
})

rpc.addMethod('nex_createWallet', () => {
	return stringToHex(JSON.stringify(createNewWalletAddress()))
})

export { rpc }
