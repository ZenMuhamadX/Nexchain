import { HexString } from 'interface/structBlock'

/**
 * Decode hex (basis 16) back to string
 * @param hex - Hexadecimal string to decode
 * @returns Decoded string
 */
export const hexToString = (hex: HexString): string => {
	// if (typeof hex != 'string') return null
	// Remove the `0x` prefix if present
	const cleanHex = hex.startsWith('0x') ? hex.slice(2) : hex

	let output = ''
	for (let i = 0; i < cleanHex.length; i += 2) {
		const code = parseInt(cleanHex.slice(i, i + 2), 16)
		output += String.fromCharCode(code)
	}
	return output
}
