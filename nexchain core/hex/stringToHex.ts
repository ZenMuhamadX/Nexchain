import { HexString } from 'interface/structBlock'

/**
 * Encode string to hex (basis 16) with `0x` prefix
 * @param input - String to encode
 * @returns Hexadecimal string
 */
export const stringToHex = (input: string): HexString => {
	let hex = '0x'
	for (let i = 0; i < input.length; i++) {
		hex += input.charCodeAt(i).toString(16).padStart(2, '0')
	}
	return hex as HexString
}
