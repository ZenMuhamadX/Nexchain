import { Node } from './nodeManager'
const ports = 3002
const node2 = new Node(ports)
setTimeout(() => {
	node2.connectToPeer(3001)
}, 5000)
