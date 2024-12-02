import { JSONRPCServer } from 'json-rpc-2.0'
import { toNxc } from 'nexchain/nexucoin/toNxc'
import { getBlockByHash } from 'nexchain/block/query/onChain/block/getBlockByHash'
import { getBlockByHeight } from 'nexchain/block/query/onChain/block/getBlockByHeight'
import { getBlockState } from 'nexchain/storage/state/getState'
import { getCurrentBlock } from 'nexchain/block/query/onChain/block/getCurrentBlock'
import { structBalance } from 'interface/structBalance'
import { getHistoryByTxHash } from 'nexchain/block/query/onChain/Transaction/getHistoryByTxHash'
import { getHistoryByAddress } from 'nexchain/block/query/onChain/Transaction/getHistoryByAddress'
import { Block } from 'nexchain/model/block/block'
import { getAccount } from 'account/balance/getAccount'
import { addTxToMempool } from 'nexchain/transaction/addTxToMempool'
import { TxInterface } from 'interface/structTx'
import { decodeTx } from 'nexchain/hex/tx/decodeTx'
import { ManageContract } from 'contract/manageContract'
import { getPendingBalance } from 'nexchain/transaction/getPendingBalance'
import { setPendingBalance } from 'nexchain/transaction/setPendingBalance'
import { createNewWalletAddress } from 'account/createNewWallet'

const rpc = new JSONRPCServer()

interface blockRequest {
	hash?: string
	blockNumber?: number
	format: 'json' | 'hex'
}

// Block

rpc.addMethod('echo', (message: any) => {
	return message
})

rpc.addMethod(
	'nex_getBlockByHash',
	async (data: blockRequest): Promise<any> => {
		return await getBlockByHash(data.hash!, data.format)
	},
)

rpc.addMethod('nex_getBlockByHeight', async (data: blockRequest) => {
	return await getBlockByHeight(data.blockNumber!, data.format)
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
	return await getBlockState()
})

rpc.addMethod('nex_getCurrentBlock', async (format: 'json' | 'hex' = 'hex') => {
	return await getCurrentBlock(format)
})

rpc.addMethod('nex_getChainId', async () => {
	return 26
})

// Account

rpc.addMethod(
	'nex_setPendingBalance',
	async (data: { address: string; pendingAmount: number }) => {
		return await setPendingBalance({
			address: data.address,
			pendingAmount: data.pendingAmount,
		})
	},
)

rpc.addMethod('nex_getPendingBalance', async (address: string) => {
	return await getPendingBalance(address)
})

rpc.addMethod('nex_getAccount', async (address: string) => {
	return await getAccount(address)
})

rpc.addMethod('nex_getContractBalance', async (address: string) => {
	return await new ManageContract(address).getContractBalance()
})

rpc.addMethod('nex_getBalance', async (address: string) => {
	const balance = await getAccount(address)
	return `${toNxc(balance?.balance!).toFixed(18)} NXC`
})

rpc.addMethod('nex_getNonceAccount', async (address: string) => {
	const account = await getAccount(address)
	return account?.nonce
})

// Transaction

rpc.addMethod('nex_getTransactionCount', async (address: string) => {
	const account = (await getAccount(address)) as structBalance
	return account?.transactionCount!
})

rpc.addMethod('nex_getTransactionByTxHash', async (txHash: string) => {
	return await getHistoryByTxHash(txHash, 'json')
})

rpc.addMethod('nex_getTransactionsByAddress', async (address: string) => {
	return await getHistoryByAddress(address, 'json')
})

rpc.addMethod('nex_sendTransaction', async (data: string) => {
	const decodedData: TxInterface = decodeTx(data)
	return await addTxToMempool(decodedData)
})

rpc.addMethod('nex_createWallet', async () => {
	return await createNewWalletAddress()
})

export { rpc }
