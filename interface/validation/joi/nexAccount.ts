import Joi from 'joi'

// Validator untuk struktur akun Ethereum
export const nexAccountValidator = Joi.object({
	address: Joi.string().required(), // Alamat akun Ethereum
	balance: Joi.number().required().min(0), // Saldo dalam wei (unit terkecil ETH)
	timesTransaction: Joi.number().required().min(0), // Jumlah transaksi
	lastTransactionDate: Joi.number().allow(null), // Tanggal transaksi terakhir (bisa null)
	nonce: Joi.number().required().min(0), // Nonce untuk menghindari replay attack
	isContract: Joi.boolean().required(), // Menandakan apakah alamat adalah kontrak pintar
	decimal: Joi.number().valid(18).required(), // Harus 18
	symbol: Joi.string().valid('nexu').required(), // Simbol mata uang
	notes: Joi.string().valid('1^18 nexu = 1 NXC').required(), // Catatan
})
