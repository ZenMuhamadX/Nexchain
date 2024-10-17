import { generateTimestampz } from 'nexchain/lib/timestamp/generateTimestampz'
import { getIpV4 } from './getIpV4'

export const getNetworkId = (): string => {
	const ipAddress = getIpV4() as string
	const timestamp = generateTimestampz()
	const data = `${ipAddress}${timestamp}`
	const hash = hashString(data).substring(0, 10)
	return `0x${hash}`
}

const hashString = (str: string): string => {
	let hash = 0
	for (let i = 0; i < str.length; i++) {
		hash = (hash << 5) - hash + str.charCodeAt(i)
		hash |= 0 // Konversi ke 32-bit integer
	}
	return Math.abs(hash).toString(36) // Konversi ke basis 36
}
