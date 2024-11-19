export class BaseContract {
	// Utilitas yang bisa digunakan oleh kontrak yang mewarisi
	protected static utils = {
		formatDate: (date: Date) => date.toISOString(),
		add: (a: number, b: number) => a + b,
		subtract: (a: number, b: number) => a - b,
		multiply: (a: number, b: number) => a * b,
		divide: (a: number, b: number) =>
			b !== 0 ? a / b : 'Error: Division by zero',
	}
	// Method untuk transfer saldo
	transfer(): boolean {
		return true
	}

	// Menggunakan utilitas formatDate untuk mendapatkan tanggal dalam format ISO
	formatCurrentDate(): string {
		return BaseContract.utils.formatDate(new Date())
	}
}
