import { blockStruct } from 'src/model/interface/blockStruct.inf'
import { getNetworkId } from './getNetId'

export const validateNetId = (block: blockStruct) => {
	const localNet = getNetworkId()
	return localNet === block.networkId
}
