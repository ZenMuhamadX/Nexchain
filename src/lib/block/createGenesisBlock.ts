import { loggingErr } from '../../logging/errorLog'
import { Block } from '../../model/Block'
import { generateBlockHash } from '../hash/generateHash'
import { generateSignature } from '../hash/generateSIgnature'
import { generateTimestampz } from '../timestamp/generateTimestampz'
import { saveBlock } from './saveBlock'

export const createGenesisBlock = (): Block => {
  try {
    const genesisBlock = new Block(0, generateTimestampz(), [], '0', '', '', 0)
    genesisBlock.hash = generateBlockHash(0, generateTimestampz(), [], '0')
    genesisBlock.signature = generateSignature(genesisBlock.hash)
    saveBlock(genesisBlock)
    return genesisBlock
  } catch (error) {
    loggingErr({
      error: error,
      stack: new Error().stack,
      time: generateTimestampz(),
    })
    throw new Error('Failed to create genesis block.')
  }
}
