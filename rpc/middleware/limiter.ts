import { rateLimit } from 'express-rate-limit'
export const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 menit
	max: 100, // Maksimal 100 request per IP
	standardHeaders: true, // Menambahkan info rate limit di header Response
	legacyHeaders: false, // Menonaktifkan header X-RateLimit-* yang usang
	validate: { xForwardedForHeader: false },
})
