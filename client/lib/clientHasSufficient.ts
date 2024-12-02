import { logToConsole } from 'logging/logging'
import { isContract } from 'nexchain/lib/isContract'
import { rpcGetAccount } from 'client/rpc-client/rpcGetAccount'
import { rpcGetContractBalance } from 'client/rpc-client/rpcGetContractBalance'
import { structBalance } from 'interface/structBalance'
import { rpcGetPendingBalance } from 'client/rpc-client/rpcGetPendingBalance'
import { toNxc } from 'nexchain/nexucoin/toNxc'

/**
 * Checks if the provided address has sufficient balance (either for a contract or a standard address).
 * @param address - The address to check balance for.
 * @param amount - The transaction amount.
 * @param fee - The transaction fee.
 * @returns True if balance is sufficient, false if insufficient, or undefined if an error occurs.
 */
export const clientHasSufficientBalance = async (
	address: string,
	amount: number,
	fee: number,
): Promise<boolean | undefined> => {
	if (!address) {
		logToConsole('Address not provided')
		return false
	}

	try {
		if (isContract(address)) {
			return await checkContractBalance(address, amount, fee)
		}
		logToConsole('Checking balance...')
		return await checkStandardBalance(address, amount, fee)
	} catch (error) {
		return undefined
	}
}

/**
 * Checks if a contract address has sufficient balance.
 * @param address - The contract address.
 * @param amount - The transaction amount.
 * @param fee - The transaction fee.
 * @returns True if balance is sufficient, false otherwise.
 */
const checkContractBalance = async (
	address: string,
	amount: number,
	fee: number,
): Promise<boolean> => {
	const balance = await rpcGetContractBalance(address)
	if (balance! >= amount + fee) {
		return true
	} else {
		logToConsole('Insufficient contract balance')
		return false
	}
}

/**
 * Checks if a standard address has sufficient balance.
 * @param address - The standard wallet address.
 * @param amount - The transaction amount.
 * @param fee - The transaction fee.
 * @returns True if balance is sufficient, false otherwise.
 */
const checkStandardBalance = async (
	address: string,
	amount: number,
	fee: number,
): Promise<boolean> => {
	const balance: structBalance = (await rpcGetAccount(address)) as structBalance
	if (!balance) {
		logToConsole('Balance not found')
		return false
	}
	if (balance.balance >= amount + fee) {
		const pendingBalance = await rpcGetPendingBalance(address)
		const availableBalance =
			balance.balance - (pendingBalance?.pendingAmount || 0)

		if (availableBalance < amount + (fee || 0)) {
			console.error(
				`The previous transcation has not been confirmed, and your balance of ${toNxc(pendingBalance?.pendingAmount!)} NXC has been locked for that transaction. Additionally,your available balance is not sufient to complete this transaction`,
			)
			return false
		}
		return true
	} else {
		logToConsole('Insufficient balance')
		return false
	}
}
