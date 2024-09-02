import { Block } from "../../model/Block"
import fs from 'node:fs'
import { deserializeBlockFromBinary } from "../utils/deserialize"

// Fungsi untuk memuat Block dari file
export const loadBlock = (fileName: string): Block | null => {
  try {
    // Baca Buffer dari file
    const buffer = fs.readFileSync(`${fileName}.dat`)
    // Deserialize buffer ke dalam objek Block
    return deserializeBlockFromBinary(buffer)
  } catch (error) {
    // Tangani error jika proses pemuatan gagal
    console.error('Error loading block:', error)
    return null
  }
}
