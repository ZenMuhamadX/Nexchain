import { BlockChains } from '../../BlockChains'

const t = new BlockChains()
const balance = t.getChains()
export const processMessage = (message: string): any => {
  if (message === 'balance') {
    return balance.map((val) => JSON.stringify(val))
  }
}
