import { logToConsole } from 'logging/logging'
import { isContract } from 'nexchain core/lib/isContract'
import { rpcGetContractBalance } from 'client/rpc-client/controller/rpcGetContractBalance'
import { rpcGetPendingBalance } from 'client/rpc-client/controller/rpcGetPendingBalance'
import { toNxc } from 'nexchain core/nexucoin/toNxc'
import { structBalanceCore } from 'interface/core/structBalanceCore'
import { loadAccountCore } from 'nexchain core/loaders/loadAccountCore'

/**
 * Checks if the provided address has sufficient balance (either for a contract or a standard address).
 * @param address - The address to check balance for.
 * @param amount - The transaction amount.
 * @param fee - The transaction fee.
 * @returns True if balance is sufficient, false if insufficient, or undefined if an error occurs.
 */
export const clientHasSufficientBalance = async (
	address: string,
	amount: bigint,
	fee: bigint,
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
		console.error(error)
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
	amount: bigint,
	fee: bigint,
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
	amount: bigint,
	fee: bigint,
): Promise<boolean> => {
	const balance: structBalanceCore = (await loadAccountCore(
		address,
	)) as structBalanceCore
	if (!balance) {
		logToConsole('Account not found')
		return false
	}
	if (balance.balance >= amount + fee) {
		const pendingBalance = await rpcGetPendingBalance(address)
		const availableBalance =
			balance.balance - (pendingBalance?.pendingAmount || 0n)

		if (availableBalance < amount + (fee || 0n)) {
			console.error(
				// eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
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
