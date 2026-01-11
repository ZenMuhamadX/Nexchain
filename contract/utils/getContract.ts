import { contract } from 'interface/structContract'
import { decodeFromBytes } from 'nexchain core/hex/bytes/decodeBytes'
import { rocksContract } from 'nexchain core/db/smartContract'

export const getContract = async (
	contractAddress: string,
): Promise<contract> => {
	const ownerAddress: Buffer = (await rocksContract.get(contractAddress, {
		fillCache: false,
	})) as Buffer
	const data = decodeFromBytes(ownerAddress)
	return JSON.parse(data) as contract
}
