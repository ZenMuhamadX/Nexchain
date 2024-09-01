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
  // const blockInfoParsed = {
  //   index: blockInfo.index,
  //   timestamp: blockInfo.timestamp,
  //   hash: blockInfo.hash,
  //   previousHash: blockInfo.previousHash,
  //   signature: blockInfo.signature,
  //   message: blockInfo.message,
  //   nonce: blockInfo.nonce,
  // }

  // console.table([blockInfoParsed])
  // Contoh data dengan objek bersarang
  const pegawai = [
    { id: 1, nama: 'Alice', departemen: { nama: 'HR', lokasi: 'Jakarta' } },
    { id: 2, nama: 'Bob', departemen: { nama: 'IT', lokasi: 'Bandung' } },
    {
      id: 3,
      nama: 'Charlie',
      departemen: { nama: 'Marketing', lokasi: 'Surabaya' },
    },
  ]

  // Menampilkan data pegawai dengan detail departemen
  console.table(pegawai, ['id', 'nama', 'departemen.nama'])
}
