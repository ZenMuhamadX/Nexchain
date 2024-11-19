type ContractClass = new (...args: any[]) => any

export class ExecPlatform {
	private contractInstance: any

	constructor() {
		this.contractInstance = null
	}

	// Muat kontrak dari modul
	async loadContract(modulePath: string, className: string): Promise<boolean> {
		console.log(`Loading contract class ${className} from ${modulePath}...`)
		try {
			const module = await import(modulePath)
			const ContractClass: ContractClass = module[className]

			if (!ContractClass) {
				throw new Error(`Class ${className} not found in the provided module.`)
			}

			// Validasi apakah kelas memiliki konstruktor yang sesuai (optional)
			if (typeof ContractClass !== 'function') {
				throw new Error(`The loaded class is not a valid constructor.`)
			}

			// Instansiasi kelas
			this.contractInstance = new ContractClass()
			console.log(`Contract class ${className} loaded successfully.`)
			return true // Mengindikasikan kontrak berhasil dimuat
		} catch (err) {
			console.error('Error loading contract:', err)
			return false // Mengindikasikan kegagalan pemuatan kontrak
		}
	}

	// Eksekusi metode dari kontrak
	executeMethod(method: string, args: any[] = []): any {
		if (!this.contractInstance) {
			console.error(
				'No contract instance loaded. Please load a contract first.',
			)
			return
		}

		console.log(`Executing method ${method}...`)
		try {
			if (typeof this.contractInstance[method] !== 'function') {
				throw new Error(`Method ${method} not found in the contract.`)
			}

			const result = this.contractInstance[method](...args)
			console.log(`Method ${method} executed successfully. Result:`, result)
			return result
		} catch (err) {
			console.error('Error during method execution:', err)
		}
	}
}
