import { Node } from './nodeManager'
const Node2 = new Node(8081)

setTimeout(() => {
	Node2.connectToPeer(8080)
}, 5000)
