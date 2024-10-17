#!/usr/bin/env bun
import { myWalletAddress } from 'nexchain/account/myWalletAddress'
import { textCli } from '../figlet/textSync'
import { getBalance } from 'nexchain/account/balance/getBalance'
import { program } from './init'
program
	.name('create-wallet')
	.description('Create NexChains Wallet Address')
	.action(() => {
		const walletAddress = myWalletAddress()
		console.log('Wallet created successfully!')
		console.log(`Wallet Address: ${walletAddress}`)
	})
program
	.command('wallet <address>')
	.description('Get Balance of Wallet Address')
	.action((address) => {
		getBalance(address)
			.then((balance) => {
				console.log(JSON.stringify(balance))
			})
			.catch((error) => {
				console.error('Error:', error)
			})
	})

// Command 2: Add
program
	.command('add <a> <b>')
	.description('Menjumlahkan dua angka')
	.action((a, b) => {
		const sum = Number(a) + Number(b)
		console.log(`Hasil: ${sum}`)
	})

// Command 3: Subtract
program
	.command('subtract <a> <b>')
	.description('Mengurangkan dua angka')
	.action((a, b) => {
		const difference = Number(a) - Number(b)
		console.log(`Hasil: ${difference}`)
	})

// Command 4: Multiply
program
	.command('multiply <a> <b>')
	.description('Mengalikan dua angka')
	.action((a, b) => {
		const product = Number(a) * Number(b)
		console.log(`Hasil: ${product}`)
	})

// Command 5: Divide
program
	.command('divide <a> <b>')
	.description('Membagi dua angka')
	.action((a, b) => {
		if (b == 0) {
			console.log('Tidak bisa membagi dengan nol.')
		} else {
			const quotient = Number(a) / Number(b)
			console.log(`Hasil: ${quotient}`)
		}
	})

// Command 6: Info
program
	.command('info')
	.description('Menampilkan informasi tentang aplikasi')
	.action(() => {
		console.log(
			'Ini adalah aplikasi CLI sederhana yang dibuat menggunakan commander.',
		)
	})
//  Tambahkan pengecekan untuk argumen

if (process.argv.length > 3) {
	program.parse(process.argv)
} else {
	textCli()
}
