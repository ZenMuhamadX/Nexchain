import { HexString } from 'interface/common/hexString'
/**
 * Decode hex (basis 16) back to string
 * @param hex - Hexadecimal string to decode
 * @returns Decoded string
 */
export const hexToString = (hex: HexString): string => {
	if (hex.startsWith('0x')) hex = hex.slice(2) as HexString
	let str = ''
	for (let i = 0; i < hex.length; i += 2) {
		str += String.fromCharCode(parseInt(hex.substr(i, 2), 16))
	}
	return str
}
