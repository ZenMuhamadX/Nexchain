import { Node } from './nodeManager'
const ports = 3001
const node1 = new Node(ports)
node1.connectToPeer(3002)
