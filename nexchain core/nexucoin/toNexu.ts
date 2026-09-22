import { DECIMALS } from 'nexchain core/DECIMALS/DECIMALS'

export const toNexu = (nxc: string): bigint => {
	const [whole, frac = ''] = nxc.split('.')
	const fracPadded = (frac + '0'.repeat(18)).slice(0, 18)
	return BigInt(whole) * DECIMALS + BigInt(fracPadded)
}
