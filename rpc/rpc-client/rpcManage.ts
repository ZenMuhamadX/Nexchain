import { structBalance } from 'interface/front/structBalance'
import { rpcRequest } from './lib/rpcRequest'
import { comTxInterface } from 'interface/front/structComTx'
import { logToConsole } from 'logging/logging'
import { clientSideTxValidate } from 'wallet/lib/clientValidateTx'
import { createTransaction } from 'wallet/lib/createTransaction'
import { askQuestion } from 'CLI/inquirer/askQuestion'
import { saveWallet } from 'libAccount/utils/saveWallet'
import { hexToString } from 'nexchain core/hex/hexToString'
import { blockState } from 'nexchain core/savers/state/setState'
import { Block } from 'nexchain core/model/block/block'
import { JSONParse } from 'nexchain core/lib/JSONParse'
import { stringToBigInt } from 'nexchain core/loaders/lib/stringToBigint'
import { TxInterfaceFront } from 'interface/front/TxinterfaceFront'

export class jsonRpcRequest {
	/**
	 * getAccount
	 */
	public async getAccount(address: string): Promise<structBalance> {
		const account = await rpcRequest('nex_getAccount', address)
		return JSONParse(hexToString(account))
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
			await saveWallet(wallet, walletName)
			return JSONParse(hexToString(wallet))
		}
		return JSONParse(hexToString(wallet))
	}
	/**
	 * getBalance
	 */
	public async getBalance(address: string): Promise<structBalance> {
		const balance = await rpcRequest('nex_getBalance', address)
		return JSONParse(hexToString(balance))
	}
	/**
	 * sendTransaction
	 */
	public async sendTransaction(
		transaction: comTxInterface,
	): Promise<{ sentStatus: boolean }> {
		const convertedTransaction = stringToBigInt(transaction)
		const completedTx = createTransaction(convertedTransaction)
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
		return JSONParse(hexToString(await rpcRequest('nex_getBlockByHash', hash)))
	}
	/**
	 * getBlockByHeight
	 */
	public async getBlockByHeight(height: number): Promise<Block> {
		return JSONParse(
			hexToString(await rpcRequest('nex_getBlockByHeight', height)),
		)
	}
	/**
	 * getBlockTransactionByHeight
	 */
	public async getBlockTransactionByHeight(height: number): Promise<number> {
		return JSONParse(
			hexToString(await rpcRequest('nex_getBlockTransactionByHeight', height)),
		)
	}
	/**
	 * getBlockTransactionByHash
	 */
	public async getBlockTransactionByHash(blockHash: string): Promise<number> {
		return JSONParse(
			hexToString(await rpcRequest('nex_getBlockTransactionByHash', blockHash)),
		)
	}
	/**
	 * getBlockState
	 */
	public async getBlockState(): Promise<blockState> {
		return JSONParse(hexToString(await rpcRequest('nex_getBlockState', '')))
	}
	/**
	 * getCurrentBlock
	 */
	public async getCurrentBlock(): Promise<Block> {
		return JSONParse(hexToString(await rpcRequest('nex_getCurrentBlock', '')))
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
	public async getTransactionByTxHash(
		txHash: string,
	): Promise<TxInterfaceFront> {
		return JSONParse(
			hexToString(await rpcRequest('nex_getTransactionByTxHash', txHash)),
		)
	}
	/**
	 * getNonceAccount
	 */
	public async getNonceAccount(address: string): Promise<number> {
		return JSONParse(
			hexToString(await rpcRequest('nex_getNonceAccount', address)),
		)
	}
	/**
	 * getTransactionsByAddress
	 */
	public async getTransactionsByAddress(
		address: string,
	): Promise<TxInterfaceFront> {
		return JSONParse(
			hexToString(await rpcRequest('nex_getTransactionsByAddress', address)),
		)
	}
}
