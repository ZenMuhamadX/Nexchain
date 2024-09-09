import { tcpNet } from './L1Net/tcp'
import { getIpv4 } from './lib/ip'
import 'dotenv/config'

const PORT = process.env.PORT || 5000
const ipAddress = getIpv4()

// Mulai server dan mendengarkan pada port
tcpNet.listen(PORT, () => {
  console.log(`network TCP running: ${ipAddress}:${PORT}`)
  console.log(`network TCP running: localhost: ${PORT}`)
})
