import os from 'os'

export const getIpv4 = () => {
	const interfaces = os.networkInterfaces()
	for (const name of Object.keys(interfaces)) {
		const iface = interfaces[name]
		if (iface) {
			for (const alias of iface) {
				if (alias.family === 'IPv4' && !alias.internal) {
					return alias.address
				}
			}
		}
	}
	return '0.0.0.0'
}
