import { getBalance } from 'nexchain/account/balance/getBalance'
import { putBalance } from 'nexchain/account/balance/putBalance'
import { isContract } from 'nexchain/lib/isContract'

export const burnNexu = async (fromAddress: string, amount: number) => {
	const burnAddress = 'NxCdead00000000000000000000000000000000dead'

	// Cek apakah alamat pengirim adalah kontrak
	if (isContract(fromAddress)) {
		throw new Error('Burn function is not allowed for contracts.')
	}

	// Ambil saldo pengirim
	const oldBalance = await getBalance(fromAddress).catch(() => null)
	if (!oldBalance) {
		throw new Error('Address not found.')
	}

	// Pastikan saldo cukup untuk pembakaran
	if (oldBalance.balance < amount) {
		throw new Error('Insufficient balance for burning.')
	}

	const newBalance = oldBalance.balance - amount

	// Perbarui saldo pengirim
	await putBalance(fromAddress, {
		address: fromAddress,
		balance: newBalance,
		decimal: 18,
		isContract: false,
		lastTransactionDate: null,
		nonce: oldBalance.nonce + 1,
		notes: '1^18 nexu = 1 NXC',
		symbol: 'nexu',
		timesTransaction: oldBalance.timesTransaction + 1,
	})

	// Ambil saldo lama dari alamat burn
	const oldBurnBalance = await getBalance(burnAddress).catch(() => ({
		address: burnAddress,
		balance: 0,
		decimal: 18,
		isContract: false,
		lastTransactionDate: null,
		nonce: 0,
		notes: '',
		symbol: 'nexu',
		timesTransaction: 0,
	}))

	const newBurnBalance = oldBurnBalance!.balance + amount

	// Perbarui saldo di alamat burn
	await putBalance(burnAddress, {
		address: burnAddress,
		balance: newBurnBalance,
		decimal: 18,
		isContract: false,
		lastTransactionDate: null,
		nonce: oldBurnBalance!.nonce + 1,
		notes: 'Burned by burnNexu function',
		symbol: 'nexu',
		timesTransaction: oldBurnBalance!.timesTransaction + 1,
	})
}
