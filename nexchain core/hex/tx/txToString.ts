import { TxInterfaceCore } from 'interface/core/TxInterfaceCore'
import { TxInterfaceFront } from 'interface/front/TxinterfaceFront'
import { bigIntToString } from 'nexchain core/savers/lib/bigintToString'

// Fungsi untuk mengonversi transaksi menjadi string untuk hashing
export const txToString = (tx: TxInterfaceCore): string => {
	const convertedTx = bigIntToString(tx) as TxInterfaceFront
	// Gabungkan properti transaksi yang relevan menjadi string
	return `${convertedTx.sender}:${convertedTx.receiver}:${convertedTx.amount}:${convertedTx.timestamp}`
}
