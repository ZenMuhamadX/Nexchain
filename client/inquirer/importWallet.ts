import { importWalletFromMnemonic } from 'account/backup/import/importWalletFromMnemonic'
import chalk from 'chalk'
import { showHeader } from 'client/figlet/header'
import { askQuestion } from 'client/inquirer/utils/askQuestion'

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
