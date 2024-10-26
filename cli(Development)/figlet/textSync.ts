import figlet from 'figlet'

export const textCli = (text: string) => {
	console.log(figlet.textSync(text, { font: 'Sub-Zero' }))
}
