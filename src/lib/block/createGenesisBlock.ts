import { loggingErr } from '../../logging/errorLog'
import { Block } from '../../model/Block'
import { generateBlockHash } from '../hash/generateHash'
import { generateSignature } from '../hash/generateSIgnature'
import { generateTimestampz } from '../timestamp/generateTimestampz'

// Create Genesis Block
export const createGenesisBlock = () => {
  try {
    const genesisBlock = new Block(0, generateTimestampz(), [], '0', '', '', 0)
    genesisBlock.hash = generateBlockHash(0, generateTimestampz(), [], '0')
    genesisBlock.signature = generateSignature(genesisBlock.hash)
    return genesisBlock
  } catch (error) {
    loggingErr({
      error: 'unknown error',
      stack: new Error().stack,
      time: generateTimestampz(),
    })
    throw error
  }
}
