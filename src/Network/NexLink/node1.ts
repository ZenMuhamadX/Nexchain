import { Node } from './nodeManager'
const Node1 = new Node(8080)

setTimeout(() => {
	Node1.connectToPeer(8081)
}, 5000)
