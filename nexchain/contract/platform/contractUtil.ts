import { ContractBase } from './baseContract'

// Fungsi utilitas untuk memverifikasi kontrak sebelum dieksekusi
export class ContractUtils {
	static validateContract(contract: ContractBase): boolean {
		// Misalnya, validasi apakah kontrak mengimplementasikan method execute
		if (typeof contract.execute !== 'function') {
			console.log('Contract must implement the execute method.')
			return false
		}
		return true
	}
}
