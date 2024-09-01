// Menyimpan nomor urut terakhir dalam variabel global untuk menghasilkan nama file yang unik
let currentNum = 0

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
