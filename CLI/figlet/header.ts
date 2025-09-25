import chalk from 'chalk'
import figlet from 'figlet'

// Fungsi untuk menampilkan header dengan ASCII art menggunakan figlet
export const showHeader = (title: string) => {
	console.log(
		chalk.blueBright(figlet.textSync(title, { horizontalLayout: 'full' })),
	)
	console.log(
		chalk.whiteBright('NexCLI is interface for intract with NexChain ...'),
	)
}
