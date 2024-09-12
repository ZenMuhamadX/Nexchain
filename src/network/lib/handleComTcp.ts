import { BlockChains } from '../../BlockChains'

const t = new BlockChains()
const balance = t.getChains()[0].walletData
export const processMessage = (message: string): any => {
	if (message === 'balance') {
		return balance
	}
}
const filter = balance.filter((item) => item.balance === 5000000)
console.log(filter)
