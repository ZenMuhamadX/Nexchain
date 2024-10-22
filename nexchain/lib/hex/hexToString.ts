import { HexString } from 'interface/structBlock'

export const hexToString = (input: HexString): string => {
	const buffer = Buffer.from(input.slice(2), 'hex')
	return buffer.toString('utf-8')
}
