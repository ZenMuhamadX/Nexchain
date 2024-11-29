import { contract } from 'interface/structContract'
import { rocksMempool } from 'nexchain/db/memPool'

export const saveContractMempool = async (
	contract: contract,
): Promise<void> => {
	if (!contract) {
		console.log('no data')
		return
	}
	// 1. Simpan contract sementara ke rocksdb
	const parseMempool = JSON.stringify(contract)
	await rocksMempool.put(
		`Contract-0x${contract.contractCodeHash}`,
		parseMempool,
		{
			sync: false,
		},
	)
}
