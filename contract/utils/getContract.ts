import { contract } from 'interface/front/structContract'
import { decodeFromBytes } from 'nexchain core/hex/bytes/decodeBytes'
import { rocksContract } from 'nexchain core/db/smartContract'
import { JSONParse } from 'nexchain core/lib/JSONParse'
import { stringToBigInt } from 'nexchain core/loaders/lib/stringToBigint'

export const getContract = async (
	contractAddress: string,
): Promise<contract> => {
	const ownerAddress: Buffer = (await rocksContract.get(contractAddress, {
		fillCache: false,
	})) as Buffer
	const data = decodeFromBytes(ownerAddress)
	const convertedData = stringToBigInt(data)
	return JSONParse(convertedData) as contract
}
