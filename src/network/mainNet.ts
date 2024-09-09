import { tcpNet } from './L1Net/tcp'

const PORT = process.env.PORT || 5000

// Mulai server dan mendengarkan pada port
tcpNet.listen(PORT, () => {
  console.log(`network running ${PORT}`)
})
