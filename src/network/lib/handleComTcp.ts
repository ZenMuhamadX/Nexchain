import { BlockChains } from '../../BlockChains'

const t = new BlockChains()
const balance = t.getChains()[0].walletData[0].address
export const processMessage = (message: string): any => {
  if (message === 'balance') {
    return balance
  }
}
