// Fungsi untuk memproses pesan
export const processMessage = (message: Buffer): any => {
  // Contoh pemrosesan pesan
  if (message.toString() === 'mine') {
    return 'Hi there!'
  } else if (message.toString() === 'hi') {
    return 'Goodbye!'
  } else {
    return `You said: ${message}`
  }
}
