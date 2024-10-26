import { HexString } from 'interface/structBlock'

export const hexToString = (hex: HexString) => {
	let str = ''
	const parsedHex = hex.slice(2)
	for (let i = 0; i < parsedHex.length; i += 2) {
		const code = parseInt(parsedHex.substring(i, i + 2), 16)
		str += String.fromCharCode(code)
	}
	return str
}
