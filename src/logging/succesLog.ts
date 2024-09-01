interface blockInfo {
  timestamp?: string
  hash?: string
  previousHash?: string
  index?: number
  signature?: string
  message?:string
  nonce?:number
}

export const succesLog = (blockInfo: blockInfo) => {
  console.log({
    index: blockInfo.index,
    timestamp: blockInfo.timestamp,
    hash: blockInfo.hash,
    previousHash: blockInfo.previousHash,
    signature: blockInfo.signature,
    message: blockInfo.message,
    nonce:blockInfo.nonce
  })
}
