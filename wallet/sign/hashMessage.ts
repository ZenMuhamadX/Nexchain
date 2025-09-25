import { sha256 } from 'nexchain core/block/sha256'

export const hashMessage = (data: string): Buffer => {
	return sha256(data, 'buffer') as Buffer
}
