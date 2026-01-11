import base58 from 'bs58'
import { stringToUint8 } from '../bytes/stringToUint8'

export const stringToBase58 = (input: string) => {
	const uint8 = stringToUint8(input)
	return base58.encode(uint8)
}
