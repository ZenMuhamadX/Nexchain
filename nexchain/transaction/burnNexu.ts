import { getAccount } from 'account/balance/getAccount'
import { putAccount } from 'account/balance/putAccount'
import { structBalance } from 'interface/structBalance'
import { isContract } from 'nexchain/lib/isContract'

export const burnNexu = async (fromAddress: string, amount: number) => {
	const burnAddress = 'NxCdead00000000000000000000000000000000dead'

	// Cek apakah alamat pengirim adalah kontrak
	if (isContract(fromAddress)) {
		throw new Error('Burn function is not allowed for contracts.')
	}

	// Ambil saldo pengirim
	const oldBalance = await getAccount(fromAddress).catch(() => null)
	if (!oldBalance) {
		throw new Error('Address not found.')
	}

	// Pastikan saldo cukup untuk pembakaran
	if (oldBalance.balance < amount) {
		throw new Error('Insufficient balance for burning.')
	}

	const newBalance = oldBalance.balance - amount

	// Perbarui saldo pengirim
	await putAccount(fromAddress, {
		address: fromAddress,
		balance: newBalance,
		isContract: false,
		lastTransactionDate: null,
		nonce: oldBalance.nonce + 1,
		transactionCount: oldBalance.transactionCount + 1,
	})

	// Ambil saldo lama dari alamat burn
	const oldBurnBalance: structBalance = (await getAccount(burnAddress).catch(
		() => ({
			address: burnAddress,
			balance: 0,
			decimal: 18,
			isContract: false,
			lastTransactionDate: null,
			nonce: 0,
			notes: '',
			symbol: 'nexu',
			transactionCount: 0,
		}),
	)) as structBalance

	const newBurnBalance = oldBurnBalance!.balance + amount

	// Perbarui saldo di alamat burn
	await putAccount(burnAddress, {
		address: burnAddress,
		balance: newBurnBalance,
		isContract: false,
		lastTransactionDate: null,
		nonce: oldBurnBalance!.nonce + 1,
		transactionCount: oldBurnBalance.transactionCount + 1,
	})
}
