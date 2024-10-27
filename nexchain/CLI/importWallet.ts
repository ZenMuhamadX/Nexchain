import chalk from 'chalk'
import { showHeader } from 'cli(Development)/figlet/header'
import { askQuestion } from 'cli(Development)/question/askQuestion'
import { importWalletFromMnemonic } from 'nexchain/backup/import/importWalletFromMnemonic'

export const CLIImportWallet = async () => {
	showHeader('NexRecovery')
	console.log(chalk.blueBright('Welcome to NexRecovery CLI'))

	// Meminta mnemonic
	const mnemonic = await askQuestion({
		message: 'Enter your mnemonic phrase:',
		type: 'password',
		name: 'mnemonic',
		description: 'Enter your mnemonic phrase to recover your wallet',
	})

	await importWalletFromMnemonic(mnemonic)
}
