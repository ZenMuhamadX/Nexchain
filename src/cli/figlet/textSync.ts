import figlet from 'figlet'

export const textCli = () => {
	console.log(figlet.textSync('NexChains', { font: 'Sub-Zero' }))
	console.log('A Next Generation Decentralized Blockchain')
}
