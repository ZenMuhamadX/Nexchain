// Fungsi untuk memproses pesan
export const processMessage = (message: string): any => {
  // Contoh pemrosesan pesan
  if (message.toLowerCase() === 'mine') {
    return 'Hi there!'
  } else if (message.toLowerCase() === 'hi') {
    return 'Goodbye!'
  } else {
    return `You said: ${message}`
  }
}
