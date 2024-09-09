import { getAllBlock, getLatestBlock } from './getBlock'

export const processMessage = (message: string): any => {
  if (message === 'allBlock') {
    return getAllBlock()
  } else if (message === 'lastBlock') {
    return getLatestBlock()
  } else {
    return message
  }
}
