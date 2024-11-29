import { contract } from 'interface/structContract'
import { rocksContract } from 'nexchain/db/smartContract'

export const saveContracts = async (contracts: contract[] | contract) => {
	if (Array.isArray(contracts)) {
		// Jika contracts adalah array, lakukan looping untuk setiap elemen
		for (const contract of contracts) {
			await rocksContract.put(
				contract.contractAddress,
				JSON.stringify(contract),
				{
					sync: false,
				},
			)
		}
	} else {
		// Jika contracts bukan array, langsung proses sebagai objek tunggal
		await rocksContract.put(
			contracts.contractAddress,
			JSON.stringify(contracts),
			{
				sync: false,
			},
		)
	}
}
