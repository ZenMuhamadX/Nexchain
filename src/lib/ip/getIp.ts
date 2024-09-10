import os from 'node:os'

export const getIpNode = () => {
  const interfaces = os.networkInterfaces()
  let ip = ''
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]!) {
      if (iface.family === 'IPv4' && !iface.internal) {
        ip = iface.address
        break
      }
    }
  }
  return ip
}
