interface blockInfo {
  timestamp?: string
  hash?: string
  previousHash?: string
  index?: number
  signature?: string
  message?: string
  nonce?: number
}

export const succesLog = (blockInfo: blockInfo) => {
  const blockInfoParsed = {
    index: blockInfo.index,
    timestamp: blockInfo.timestamp,
    hash: blockInfo.hash,
    previousHash: blockInfo.previousHash,
    signature: blockInfo.signature,
    message: blockInfo.message,
    nonce: blockInfo.nonce,
  }

  console.info(blockInfoParsed)
}
