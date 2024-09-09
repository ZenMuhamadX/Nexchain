export const processMessage = (message: any): string => {
  // 1. Parsing pesan
  //    - Pisahkan pesan berdasarkan delimiter (misalnya, spasi, koma, atau karakter khusus)
  //    - Ubah tipe data jika diperlukan (misalnya, string ke number)
  const parts = message.split(' ') // Contoh: memisahkan pesan berdasarkan spasi
  const command = parts[0]

  // 2. Menangani command/perintah
  //    - Gunakan switch case atau if/else untuk menangani berbagai jenis pesan
  switch (command) {
    case 'getData':
      // Logika untuk mengambil data
      return 'Data yang diminta'
    case 'setData':
      // Logika untuk menyimpan data
      return 'Data berhasil disimpan'
    default:
      return 'Perintah tidak valid'
  }
}
