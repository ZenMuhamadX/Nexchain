import { openDb } from 'nexchain/db/openDb'
import { app } from './app/app'

// Jalankan server
const PORT = 8000
app.listen(PORT, '0.0.0.0', async () => {
	// await openDb()
	console.log(`RPC server running on port ${PORT}`)
})
