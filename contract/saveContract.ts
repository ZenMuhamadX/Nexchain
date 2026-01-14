import { contract } from 'interface/front/structContract'
import { rocksContract } from 'nexchain core/db/smartContract'
import { JSONStringify } from 'nexchain core/lib/JSONStringify'
import { bigIntToString } from 'nexchain core/savers/lib/bigintToString'

export const saveContracts = async (contracts: contract[] | contract) => {
	if (Array.isArray(contracts)) {
		// Jika contracts adalah array, lakukan looping untuk setiap elemen
		for (const contract of contracts) {
			const convertedContract = bigIntToString(contract)
			await rocksContract.put(
				contract.contractAddress,
				JSONStringify(convertedContract),
				{
					sync: false,
				},
			)
		}
	} else {
		// Jika contracts bukan array, langsung proses sebagai objek tunggal
		await rocksContract.put(
			contracts.contractAddress,
			JSONStringify(contracts),
			{
				sync: false,
			},
		)
	}
}
