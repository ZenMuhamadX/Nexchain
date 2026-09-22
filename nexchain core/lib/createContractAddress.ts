import { keccak256 } from 'js-sha3'

export const createContractAdrress = (owner: string, nonce: number): string => {
	return `NxS${keccak256(`${owner}-${nonce}`).slice(-40)}`
}
