import inquirer from 'inquirer'
import { existsSync, mkdirSync, writeFileSync } from 'fs'
import { structWalletToSave } from 'interface/structWalletToSave'
import path from 'path'

export const saveWallet = async (
	data: structWalletToSave,
	fileName: string,
) => {
	const dirPath = path.join(__dirname, '../../../wallet/')
	const filePath = path.join(dirPath, `${fileName}.json`)

	try {
		if (!existsSync(dirPath)) {
			mkdirSync(dirPath, { recursive: true })
		}

		if (existsSync(filePath)) {
			const { overwrite } = await inquirer.prompt([
				{
					type: 'confirm',
					name: 'overwrite',
					message: 'Wallet already exists. Do you want to overwrite it?',
					default: false,
				},
			])

			if (overwrite) {
				writeFileSync(filePath, JSON.stringify(data, null, 2))
				console.log(`Wallet saved to ${filePath}`)
			} else {
				console.log('Wallet not saved.')
			}
		} else {
			const { create } = await inquirer.prompt([
				{
					type: 'confirm',
					name: 'create',
					message: `Wallet created do you want to save it to "${fileName}"?`,
					default: true,
				},
			])

			if (create) {
				writeFileSync(filePath, JSON.stringify(data, null, 2))
				console.log(`Wallet created and saved to ${filePath}`)
				console.info({
					seedPhrase: data.mnemonic,
					walletAddress: data.walletAddress,
				})
			} else {
				console.log('Wallet not saved')
				console.info({
					seedPhrase: data.mnemonic,
					walletAddress: data.walletAddress,
				})
			}
		}
	} catch (error) {
		console.error('Error saving wallet:', error)
	}
}
