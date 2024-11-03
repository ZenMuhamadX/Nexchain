import { contract } from 'interface/structContract'
import { getBalance } from 'nexchain/account/balance/getBalance'
import { putBalance } from 'nexchain/account/balance/putBalance'
import { isContract } from 'nexchain/lib/isContract'
import { saveContracts } from 'nexchain/smartContracts/saveContract'
import { getContract } from 'nexchain/smartContracts/utils/getContract'

export const burnNexu = async (fromAddress: string, amount: number) => {
	const burnAddress = 'NxCdead00000000000000000000000000000000dead'
	const oldBurnBalance = await getBalance(burnAddress) // Ambil saldo lama pembakaran
	const newBurnBalance = oldBurnBalance?.balance! + amount // Tambahkan jumlah yang dibakar
	const contract = isContract(fromAddress)
	if (contract) {
		const oldBalance: contract = await getContract(fromAddress)

		if (!oldBalance) {
			throw new Error('contract not found.') // Menangani jika alamat tidak ditemukan
		}

		if (oldBalance!.balance < amount) {
			throw new Error('Insufficient balance for gas fee.') // Menangani jika saldo tidak mencukupi
		}

		const newBalance = oldBalance!.balance - amount

		await saveContracts({
			balance: newBalance,
			contractAddress: fromAddress,
			deployedAt: oldBalance!.deployedAt,
			owner: oldBalance!.owner,
			status: oldBalance!.status,
			deploymentTransactionHash: oldBalance!.deploymentTransactionHash,
		})

		// Perbarui saldo di alamat burn
		await putBalance(burnAddress, {
			address: burnAddress,
			balance: newBurnBalance,
			decimal: 18,
			isContract: false,
			lastTransactionDate: null,
			nonce: oldBurnBalance!.nonce + 1, // Menjaga nonce yang benar untuk burn address
			notes: 'Burned by burnNexu function',
			symbol: 'nexu',
			timesTransaction: oldBurnBalance!.timesTransaction + 1,
		})
		return
	}
	const oldBalance = await getBalance(fromAddress).catch(() => null)

	if (!oldBalance) {
		throw new Error('Address not found.') // Menangani jika alamat tidak ditemukan
	}

	if (oldBalance!.balance < amount) {
		throw new Error('Insufficient balance for gas fee.') // Menangani jika saldo tidak mencukupi
	}

	const newBalance = oldBalance!.balance - amount

	// Perbarui saldo pengirim
	await putBalance(fromAddress, {
		address: fromAddress,
		balance: newBalance,
		decimal: 18,
		isContract: false,
		lastTransactionDate: null,
		nonce: oldBalance!.nonce + 1, // Meningkatkan nonce untuk transaksi
		notes: '1^18 nexu = 1 NXC',
		symbol: 'nexu',
		timesTransaction: oldBalance!.timesTransaction,
	})

	// Perbarui saldo di alamat burn
	await putBalance(burnAddress, {
		address: burnAddress,
		balance: newBurnBalance,
		decimal: 18,
		isContract: false,
		lastTransactionDate: null,
		nonce: oldBalance!.nonce + 1, // Menjaga nonce yang benar untuk burn address
		notes: 'Burned by burnNexu function',
		symbol: 'nexu',
		timesTransaction: oldBalance!.timesTransaction + 1,
	})
}
