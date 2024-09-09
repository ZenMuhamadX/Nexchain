// Fungsi untuk memproses pesan
export const processMessage = (message: Buffer): any => {
  if (message.toString() === 'ping') {
    return 'pong'
  }
  return `asu`
}
