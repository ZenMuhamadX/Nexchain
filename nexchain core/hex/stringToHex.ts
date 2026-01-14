import { HexString } from 'interface/common/hexString'
/**
 * Encode string to hex (basis 16) with `0x` prefix
 * @param input - String to encode
 * @returns Hexadecimal string
 */
export const stringToHex = (input: string): HexString => {
	const hex = Array.from(input)
		.map((c) => c.charCodeAt(0).toString(16).padStart(2, '0'))
		.join('')
	return `0x${hex}` as HexString
}
