import { chains } from './chains'

export const getAllBlock = () => {
  return chains.getChains()
}

export const getLatestBlock = () => {
  return chains.getLatestBlock()
}
