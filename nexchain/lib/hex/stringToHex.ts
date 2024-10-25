import { HexString } from 'interface/structBlock'

export const stringToHex = (input: string): HexString => {
	const buffer = Buffer.from(input, 'utf-8')
	return `0x${buffer.toString('hex')}`
}
