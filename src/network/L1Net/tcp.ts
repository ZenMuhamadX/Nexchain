import * as net from 'net'
import { processMessage } from '../lib/handleComTcp'

// Membuat server TCP
export const tcpNet = net.createServer((socket) => {
  console.log('peer connected')

  // Mengatur encoding untuk data yang diterima
  socket.setEncoding('utf8')

  // Ketika data diterima dari client
  socket.on('data', (data) => {

    // Memproses pesan
    const response = processMessage(data)

    // Mengirimkan balasan ke client
    socket.write(response)
  })

  // Ketika client disconnect
  socket.on('end', () => {
    console.log('peer disconnected')
  })

  // Menangani error
  socket.on('error', (err) => {
    console.error(`Socket error: ${err}`)
  })
})
