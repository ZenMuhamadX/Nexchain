import { structBalance } from 'interface/structBalance'
import { rpcRequest } from './lib/rpcRequest'
import { comTxInterface } from 'interface/structComTx'
import { logToConsole } from 'logging/logging'
import { clientSideTxValidate } from 'client/lib/clientValidateTx'
import { createTransaction } from 'client/lib/createTransaction'
import { askQuestion } from 'client/inquirer/askQuestion'
import { saveWallet } from 'account/utils/saveWallet'
import { hexToString } from 'nexchain/hex/hexToString'
import { blockState } from 'nexchain/storage/state/setState'
import { Block } from 'nexchain/model/block/block'
import { TxInterface } from 'interface/structTx'

export class jsonRpcRequest {
	/**
	 * getAccount
	 */
	public async getAccount(address: string): Promise<structBalance> {
		const account = await rpcRequest('nex_getAccount', address)
		return JSON.parse(hexToString(account))
	}
	/**
	 * createWallet
	 */
	public async createWallet(): Promise<{ address: string; phrase: string }> {
		const wallet = await rpcRequest('nex_createWallet', '')
		logToConsole('Wallet created succesfully')
		const isSaveWallet = await askQuestion({
			message: 'Do you want to save wallet to file?',
			type: 'confirm',
			default: true,
			name: 'saveWallet',
			description: 'Save wallet to file',
		})
		if (isSaveWallet) {
			const walletName = await askQuestion({
				message: 'Enter wallet name',
				type: 'input',
				default: 'wallet',
				name: 'walletName',
				description: 'Wallet name',
			})
			const parseWallet = JSON.parse(wallet)
			await saveWallet(parseWallet, walletName)
			return parseWallet
		}
		console.log(JSON.parse(wallet))
		return JSON.parse(wallet)
	}
	/**
	 * getBalance
	 */
	public async getBalance(address: string): Promise<string> {
		const balance = await rpcRequest('nex_getBalance', address)
		return hexToString(balance)
	}
	/**
	 * sendTransaction
	 */
	public async sendTransaction(
		transaction: comTxInterface,
	): Promise<{ sentStatus: boolean }> {
		const completedTx = createTransaction(transaction)
		try {
			logToConsole('Validating transaction...')
			const isValidTx = await clientSideTxValidate(completedTx.rawData!)
			if (!isValidTx) {
				logToConsole('Transaction is not valid')
				return { sentStatus: false }
			}

			logToConsole('Sending transaction via RPC...')
			const isSuccess = await rpcRequest(
				'nex_sendTransaction',
				completedTx.base64Data,
			)
			logToConsole(`Transaction sent successfully: ${completedTx.txHash}`)

			return { sentStatus: isSuccess }
		} catch (error) {
			console.error('Error occurred during send transaction:', error)
			return { sentStatus: false }
		}
	}
	/**
	 * getBlockByHash
	 */
	public async getBlockByHash(hash: string): Promise<Block> {
		return JSON.parse(hexToString(await rpcRequest('nex_getBlockByHash', hash)))
	}
	/**
	 * getBlockByHeight
	 */
	public async getBlockByHeight(height: number): Promise<Block> {
		return JSON.parse(
			hexToString(await rpcRequest('nex_getBlockByHeight', height)),
		)
	}
	/**
	 * getBlockTransactionByHeight
	 */
	public async getBlockTransactionByHeight(height: number): Promise<number> {
		return JSON.parse(
			hexToString(await rpcRequest('nex_getBlockTransactionByHeight', height)),
		)
	}
	/**
	 * getBlockTransactionByHash
	 */
	public async getBlockTransactionByHash(blockHash: string): Promise<number> {
		return JSON.parse(
			hexToString(await rpcRequest('nex_getBlockTransactionByHash', blockHash)),
		)
	}
	/**
	 * getBlockState
	 */
	public async getBlockState(): Promise<blockState> {
		return JSON.parse(hexToString(await rpcRequest('nex_getBlockState', '')))
	}
	/**
	 * getCurrentBlock
	 */
	public async getCurrentBlock(): Promise<Block> {
		return JSON.parse(hexToString(await rpcRequest('nex_getCurrentBlock', '')))
	}
	/**
	 * getChainId
	 */
	public async getChainId(): Promise<number> {
		return await rpcRequest('nex_getChainId', '')
	}
	/**
	 * getTransactionByTxHash
	 */
	public async getTransactionByTxHash(txHash: string): Promise<TxInterface> {
		return JSON.parse(
			hexToString(await rpcRequest('nex_getTransactionByTxHash', txHash)),
		)
	}
	/**
	 * getNonceAccount
	 */
	public async getNonceAccount(address: string): Promise<number> {
		return JSON.parse(
			hexToString(await rpcRequest('nex_getNonceAccount', address)),
		)
	}
	/**
	 * getTransactionsByAddress
	 */
	public async getTransactionsByAddress(address: string): Promise<TxInterface> {
		return await rpcRequest('nex_getTransactionsByAddress', address)
	}
}
