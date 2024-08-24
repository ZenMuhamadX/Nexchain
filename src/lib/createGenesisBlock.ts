import { block } from '../block/block'
import { generateTimestampz } from './generateTimestampz'

export const createGenesisBlock = () => {
  const time = generateTimestampz()
  return new block(0, time, [], '0')
}
