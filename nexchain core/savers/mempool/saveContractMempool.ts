import { contract } from 'interface/front/structContract'
import { rocksMempool } from 'nexchain core/db/memPool'
import { JSONStringify } from 'nexchain core/lib/JSONStringify'
import { bigIntToString } from 'nexchain core/savers/lib/bigintToString'

export const saveContractMempool = async (
	contract: contract,
): Promise<void> => {
	if (!contract) {
		console.log('no data')
		return
	}
	// 1. Simpan contract sementara ke rocksdb
	const convertedContract = bigIntToString(contract)
	const parseMempool = JSONStringify(convertedContract)
	await rocksMempool.put(
		`Contract-0x${contract.contractCodeHash}`,
		parseMempool,
		{
			sync: false,
		},
	)
}
