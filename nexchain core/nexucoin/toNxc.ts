import { DECIMALS } from 'nexchain core/DECIMALS/DECIMALS'

export const toNxc = (nexu: bigint): string => {
	const whole = nexu / DECIMALS
	const frac = nexu % DECIMALS
	return `${whole}.${frac.toString().padStart(18, '0')}`
}
