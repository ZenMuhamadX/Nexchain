import { contract } from 'interface/structContract'
import { decodeFromBytes } from 'nexchain/hex/bytes/decodeBytes'
import { rocksContract } from 'nexchain/db/smartContract'

export const getContract = async (
	contractAddress: string,
): Promise<contract> => {
	const ownerAddress: Buffer = (await rocksContract.get(contractAddress, {
		fillCache: false,
		asBuffer: true,
	})) as Buffer
	const data = decodeFromBytes(ownerAddress)
	return JSON.parse(data) as contract
}