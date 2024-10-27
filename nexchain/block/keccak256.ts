import { keccak256 as keccak_256 } from 'js-sha3'

export const keccak256 = (input: Buffer): string => {
	return keccak_256(input)
}
