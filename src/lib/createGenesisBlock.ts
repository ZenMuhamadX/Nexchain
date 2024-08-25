import { Block } from '../model/Block'
// Create Genesis Block
export const createGenesisBlock = () => {
  return new Block(
    0,
    '2024-01-01T00:00:00Z',
    [
      {
        sender: 'genesis',
        recipient: 'genesis',
        amount: 0,
        message: 'Genesis Block',
      },
    ],
    ''
  )
}
