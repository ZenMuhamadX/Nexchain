import inquirer from 'inquirer'
import chalk from 'chalk'

interface choice {
	name: string
	value: any
}

// Fungsi untuk menanyakan pertanyaan dengan tema dan deskripsi khusus
export const askQuestion = async (question: {
	type: 'input' | 'confirm' | 'list'
	name: string
	message: string
	description?: string // Deskripsi tambahan untuk ditampilkan sebelum pertanyaan
	choices?: choice[] // Hanya untuk tipe 'list'
	default?: any
}) => {
	// Menampilkan deskripsi jika ada
	if (question.description) {
		console.log(chalk.yellowBright(question.description))
	}

	// Pesan pertanyaan dengan warna yang menarik
	let formattedMessage = chalk.cyanBright(question.message)

	const prompt = {
		type: question.type,
		name: question.name,
		message: formattedMessage,
		default: question.default,
	}

	// Jika tipe pertanyaan adalah 'list', tambahkan pilihan
	if (question.type === 'list' && question.choices) {
		Object.assign(prompt, { choices: question.choices })
	}

	// Prompt ke pengguna dan kembalikan hasilnya
	const answer = await inquirer.prompt([prompt])
	return answer[question.name]
}
