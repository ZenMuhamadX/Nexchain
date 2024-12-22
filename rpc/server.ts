import { app } from './app/app'

// Jalankan server
const PORT = 8000
app.listen(PORT, '0.0.0.0', () => {
	console.log(`RPC server running on port ${PORT}`)
})
