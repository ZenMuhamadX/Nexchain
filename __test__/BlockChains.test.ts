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
const mockedGenerateBlockHash = generateBlockHash as jest.MockedFunction<
  typeof generateBlockHash
>
const mockedTxPool = TxPool as jest.MockedClass<typeof TxPool>

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

  test('validates the chain correctly', () => {
    const mockGenesisBlock = new Block(0, '2024-08-24T00:00:00Z', [], '0')
    const mockNewBlock = new Block(
      1,
      '2024-08-24T01:00:00Z',
      [],
      mockGenesisBlock.hash
    )

    mockedCreateGenesisBlock.mockReturnValue(mockGenesisBlock)
    mockedGenerateBlockHash.mockReturnValue(mockGenesisBlock.hash) // Correct hash for genesis block
    mockedGenerateBlockHash.mockReturnValue(mockNewBlock.hash) // Correct hash for new block

    const blockChains = new BlockChains()
    blockChains.addTxToBlock(new mockedTxPool())

    expect(blockChains.isChainValid()).toBe(true)
  })
})
