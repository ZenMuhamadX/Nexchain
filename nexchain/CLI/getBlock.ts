import chalk from 'chalk'
import { showHeader } from 'cli(Development)/figlet/header'
import { askQuestion } from 'cli(Development)/question/askQuestion'
import { getBlockByHash } from 'nexchain/block/query/onChain/block/getBlockByHash'
import { getBlockByHeight } from 'nexchain/block/query/onChain/block/getBlockByHeight'
import { getCurrentBlock } from 'nexchain/block/query/onChain/block/getCurrentBlock'

export const CLIQueryBlock = async () => {
	showHeader('NexChain')
	console.log(chalk.blueBright('Welcome to NexChain CLI'))

	const getBlockBy = await askQuestion({
		message: 'Query block by:',
		type: 'list',
		name: 'getBlockBy',
		description: 'Choice query block by',
		choices: [
			{
				name: 'Height',
				value: 'height',
			},
			{
				name: 'Hash',
				value: 'hash',
			},
			{
				name: 'Current',
				value: 'current',
			},
		],
	})

	// Tanyakan encoding setelah pengguna memilih query
	const encoding = await askQuestion({
		message: 'Choose encoding format:',
		type: 'list',
		name: 'encoding',
		description: 'Select the encoding format for the output',
		choices: [
			{
				name: 'JSON',
				value: 'json',
			},
			{
				name: 'Hexadecimal',
				value: 'hex',
			},
		],
	})

	let inputValue

	// Tanyakan input tambahan jika pilihan bukan 'current'
	if (getBlockBy !== 'current') {
		inputValue = await askQuestion({
			message: `Please enter the ${getBlockBy} value:`,
			type: 'input',
			name: 'inputValue',
			description: `Enter the ${getBlockBy} to query:`,
		})
	}

	// Panggil fungsi berdasarkan metode query dan encoding
	switch (getBlockBy) {
		case 'height':
			getBlockByHeight(inputValue, encoding).then(console.log)
			break
		case 'hash':
			getBlockByHash(inputValue, encoding)
			break
		case 'current':
			getCurrentBlock(encoding)
			break
		default:
			console.log('Invalid choice')
			break
	}
}
