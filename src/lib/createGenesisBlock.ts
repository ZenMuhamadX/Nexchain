import { loggingErr } from '../logging/errorLog'
import { succesLog } from '../logging/succesLog'
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
      `${generateSignature(`${generateBlockHash(0, '01/01/2023', [], '0')}`)}`
    )
    succesLog({
      hash: genesisBlock.hash,
      previousHash: genesisBlock.previousHash,
      index: genesisBlock.index,
      signature: genesisBlock.signature,
      timestamp: genesisBlock.timestamp,
    })
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
