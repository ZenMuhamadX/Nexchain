import base58 from 'bs58'
import { uint8ToString } from '../bytes/uint8Tostring'
export const base58ToString = (input: string): string => {
	const uint8 = base58.decode(input)
	return uint8ToString(uint8)
}
