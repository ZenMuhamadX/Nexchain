import 'dotenv/config'

export const getNetworkId = () => {
	if (process.env.NETWORK === 'Mainnet') {
		return 1
	} else if (process.env.NETWORK === 'Testnet') {
		return 2
	} else if (process.env.NETWORK === 'Localnet') {
		return 3
	} else {
		return 0
	}
}
