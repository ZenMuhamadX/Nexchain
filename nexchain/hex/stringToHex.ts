import { HexString } from 'interface/structBlock'

export const stringToHex = (input: string): HexString => {
	return `0x${Array.from(input)
		.map((char) => char.charCodeAt(0).toString(16).padStart(2, '0'))
		.join('')}`
}
