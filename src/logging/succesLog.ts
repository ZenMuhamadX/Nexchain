interface blockInfo {
  timestamp: string
  hash: string
  previousHash: string
  index: number
  signature: string
}

export const succesLog = (blockInfo: blockInfo) => {
  console.log({
    index: blockInfo.index,
    timestamp: blockInfo.timestamp,
    hash: blockInfo.hash,
    previousHash: blockInfo.previousHash,
    signature: blockInfo.signature,
  })
}
