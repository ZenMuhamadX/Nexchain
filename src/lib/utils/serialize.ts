import { BSON } from 'bson'
import { Block } from '../../model/Block'

// Fungsi untuk meng-serialize objek Block menjadi Buffer menggunakan BSON
export const serializeBlockToBinary = (block: Block): Buffer => {
  try {
    // Serialize block ke dalam format BSON
    const serializedBlock = BSON.serialize(block)
    // Konversi serializedBlock ke Buffer
    return Buffer.from(serializedBlock)
  } catch (error) {
    // Tangani error jika proses serialisasi gagal
    console.error('Error serializing block:', error)
    throw new Error('Failed to serialize block')
  }
}
