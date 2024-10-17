import { chains } from './initBlock'

export const isChainsValid = async () => {
	return await chains.verify()
}
