// __tests__/BlockChains.test.ts
import { BlockChains } from '../src/BlockChains'
import { TxPool } from '../src/Tx/TxPool'
import { Block } from '../src/model/Block'
import { createGenesisBlock } from '../src/lib/createGenesisBlock'
import { generateBlockHash } from '../src/lib/generateHash'
import { generateTimestampz } from '../src/lib/generateTimestampz'
import { TxInterface } from '../src/model/Tx'

jest.mock('../src/lib/createGenesisBlock')
jest.mock('../src/lib/generateHash')
jest.mock('../src/lib/generateTimestampz')
jest.mock('../src/Tx/TxPool')

const mockedCreateGenesisBlock = createGenesisBlock as jest.MockedFunction<
  typeof createGenesisBlock
>

describe('BlockChains', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('initializes with a genesis block', () => {
    const mockGenesisBlock = new Block(0, '2024-08-24T00:00:00Z', [], '0')
    mockedCreateGenesisBlock.mockReturnValue(mockGenesisBlock)

    const blockChains = new BlockChains()
    const chains = blockChains.getChains()

    expect(chains[0]).toEqual({
      index: 0,
      timestamp: '2024-08-24T00:00:00Z',
      transactions: [],
      previousHash: '0',
      hash: mockGenesisBlock.hash,
    })
  })
})
