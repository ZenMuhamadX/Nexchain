import fs from 'fs'
import { Block } from '../model/Block'
import { BSON } from 'bson'

// Menyimpan nomor urut terakhir dalam variabel global untuk menghasilkan nama file yang unik
let currentNum = 0

// Fungsi untuk meng-serialize objek Block menjadi Buffer menggunakan BSON
const serializeBlockToBinary = (block: Block): Buffer => {
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

// Fungsi untuk mendeserialize Buffer menjadi objek Block menggunakan BSON
const deserializeBlockFromBinary = (buffer: Buffer): Block => {
  try {
    // Deserialize buffer kembali ke objek Block
    const deserializedBlock = BSON.deserialize(buffer)
    // Cast deserializedBlock ke tipe Block yang tepat
    return deserializedBlock as Block
  } catch (error) {
    // Tangani error jika proses deserialisasi gagal
    console.error('Error deserializing block:', error)
    throw new Error('Failed to deserialize block')
  }
}

// Fungsi untuk mendapatkan nama file block berikutnya dengan nomor urut yang di-format
const getBlockName = (): string => {
  // Increment nomor urut
  currentNum++
  // Format nomor dengan jumlah digit yang diinginkan, misalnya 10 digit
  const numDigits = 7 // Ganti sesuai panjang yang diinginkan
  const formattedNum = currentNum.toString().padStart(numDigits, '0')
  // Kembalikan nama file dengan format yang sesuai
  return `blk${formattedNum}`
}

// Fungsi untuk menyimpan Block ke dalam file
export const saveBlock = (blockData: Block): boolean => {
  try {
    // Serialize blockData ke dalam format binary
    const serializeBlock = serializeBlockToBinary(blockData)
    // Dapatkan nama file untuk menyimpan block
    const fileName = getBlockName()
    // Tulis Buffer ke dalam file dengan nama yang dihasilkan
    fs.writeFileSync(`${fileName}.dat`, serializeBlock, 'binary')
    return true
  } catch (error) {
    // Tangani error jika proses penyimpanan gagal
    console.error('Error saving block:', error)
    return false
  }
}

// Fungsi untuk memuat Block dari file
export const loadBlock = (fileName: string): Block | null => {
  try {
    // Baca Buffer dari file
    const buffer = fs.readFileSync(`${fileName}.bin`)
    // Deserialize buffer ke dalam objek Block
    return deserializeBlockFromBinary(buffer)
  } catch (error) {
    // Tangani error jika proses pemuatan gagal
    console.error('Error loading block:', error)
    return null
  }
}
