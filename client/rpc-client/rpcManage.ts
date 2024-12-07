import { structBalance } from 'interface/structBalance'
import { rpcRequest } from './rpcRequest'
import { comTxInterface } from 'interface/structComTx'
import { logToConsole } from 'logging/logging'
import { clientSideTxValidate } from 'client/lib/clientValidateTx'
import { createTransaction } from 'client/lib/createTransaction'
import { askQuestion } from 'client/inquirer/askQuestion'
import { saveWallet } from 'account/utils/saveWallet'

export class jsonRpcRequest {
	/**
	 * getAccount
	 */
	public async getAccount(address: string): Promise<structBalance> {
		return await rpcRequest('nex_getAccount', address)
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
			return wallet
		}
		return wallet
	}
	/**
	 * getBalance
	 */
	public async getBalance(address: string): Promise<structBalance> {
		return await rpcRequest('nex_getBalance', address)
	}
	/**
	 * sendTransaction
	 */
	public async sendTransaction(transaction: comTxInterface) {
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
}
