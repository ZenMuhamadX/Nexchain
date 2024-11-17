// Kelas dasar untuk kontrak, tempat pengguna akan mewarisi dan menulis logika mereka
export abstract class ContractBase {
	contractId: string
	constructor(contractId: string) {
		this.contractId = contractId
	}

	// Method untuk kontrak dieksekusi
	abstract execute(): void
}
