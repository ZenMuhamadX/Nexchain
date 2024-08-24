import { Block } from '../model/Block'
import { generateTimestampz } from './generateTimestampz'

export const createGenesisBlock = () => {
  const time = generateTimestampz()
  return new Block(
    0,
    time,
    [{ sender: 'Genesis Block', receiver: 'Genesis Block', amount: 0 }],
    ''
  )
}
