interface status {
  mined_at: string
  hash: string
  miner: string
  difficulty: number
  nonce: number
}

export const mineLog = (status: status) => {
  console.log({
    mined_at: status.mined_at,
    hash: status.hash,
    miner: status.miner,
    difficulty: status.difficulty,
    nonce: status.nonce,
  })
}
