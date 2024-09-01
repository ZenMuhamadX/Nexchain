import { loggingErr } from '../logging/errorLog'
import { proofOfWork } from '../miner/POW'
import { Block } from '../model/Block'
import { generateBlockHash } from './generateHash'
import { generateSignature } from './generateSIgnature'
import { generateTimestampz } from './generateTimestampz'

// Create Genesis Block
export const createGenesisBlock = () => {
  try {
    const genesisBlock = new Block(
      0,
      `${generateTimestampz()}`,
      [],
      '0',
      `${generateBlockHash(0, '01/01/2023', [], '0')}`,
      `0`,
      0
    )
    genesisBlock.signature = generateSignature(genesisBlock.hash)
    return genesisBlock
  } catch (error) {
    loggingErr({
      error: error as string,
      time: generateTimestampz(),
      hint: 'Error in createGenesisBlock',
    })
    throw error
  }
}
