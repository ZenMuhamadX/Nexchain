import { tcpNet } from './L1Net/tcp'
import os from 'os'
import 'dotenv/config'

const PORT = process.env.PORT || 5000

const ip = os.networkInterfaces().eth0!
let ipAddress = ''
if (ip[0].family === 'IPv4') {
  ipAddress = ip[0].address
}

// Mulai server dan mendengarkan pada port
tcpNet.listen(PORT, () => {
  console.log(`network TCP running: ${ipAddress}:${PORT}`)
  console.log(`network TCP running: localhost: ${PORT}`)
})
