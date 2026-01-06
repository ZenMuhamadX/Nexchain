import { useState, useEffect } from 'react'
import { Send, Wallet, ArrowUpRight, Clock, ShieldCheck } from 'lucide-react'
// Import fungsi blockchain lokal
// import { sendNXC, fetchBalance } from './blockchainService'

const NXCDashboard = () => {
	const [balance, setBalance] = useState(0)
	const [recipient, setRecipient] = useState('')
	const [amount, setAmount] = useState('')
	const [status, setStatus] = useState(null)

	useEffect(() => {
		async function loadData() {
			// const bal = await fetchBalance()
			setBalance(1000)
		}
		loadData()
	}, [])

	const handleTransfer = async () => {
		setStatus(null)
		// e.preventDefault()
		// setStatus('Processing...')
		// try {
		// 	const result = await sendNXC(recipient, amount)
		// 	if (result.success) {
		// 		setStatus(`Success! Hash: ${result.txHash}`)
		// 		setAmount('')
		// 		setRecipient('')
		// 	}
		// } catch (err) {
		// 	setStatus('Transaction Failed')
		// }
	}

	return (
		<div className="min-h-screen bg-slate-900 text-white p-6 font-sans">
			{/* Header */}
			<div className="max-w-4xl mx-auto flex justify-between items-center mb-8">
				<h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
					<div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-xs">
						NXC
					</div>
					NXC Token Wallet
				</h1>
				<div className="bg-slate-800 px-4 py-2 rounded-lg border border-slate-700 flex items-center gap-3">
					<ShieldCheck className="text-green-400 w-5 h-5" />
					<span className="text-sm font-mono">Local Node Connected</span>
				</div>
			</div>

			<div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
				{/* Balance Card */}
				<div className="md:col-span-1 bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-3xl shadow-xl flex flex-col justify-between">
					<div>
						<p className="text-blue-100 text-sm opacity-80">Total Balance</p>
						<h2 className="text-4xl font-bold mt-1">
							{balance} <span className="text-xl font-light">NXC</span>
						</h2>
					</div>
					<div className="mt-8 flex gap-2">
						<div className="bg-white/20 p-2 rounded-lg">
							<Wallet />
						</div>
						<p className="text-xs self-center font-mono">
							ID: nxc_local_main_01
						</p>
					</div>
				</div>

				{/* Transaction Form */}
				<div className="md:col-span-2 bg-slate-800 p-8 rounded-3xl border border-slate-700">
					<h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
						<Send className="w-5 h-5 text-blue-400" /> Send NXC
					</h3>
					<form onSubmit={handleTransfer} className="space-y-4">
						<div>
							<label className="block text-sm text-slate-400 mb-1">
								Recipient Address
							</label>
							<input
								type="text"
								value={recipient}
								onChange={(e) => setRecipient(e.target.value)}
								className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
								placeholder="0x..."
							/>
						</div>
						<div>
							<label className="block text-sm text-slate-400 mb-1">
								Amount
							</label>
							<input
								type="number"
								value={amount}
								onChange={(e) => setAmount(e.target.value)}
								className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
								placeholder="0.00"
							/>
						</div>
						<button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-xl transition-colors shadow-lg shadow-blue-500/20">
							Execute Transaction
						</button>
						{status && (
							<p className="mt-4 text-center text-sm font-mono text-blue-300">
								{status}
							</p>
						)}
					</form>
				</div>

				{/* History Placeholder */}
				<div className="md:col-span-3 bg-slate-800/50 p-6 rounded-3xl border border-slate-700 mt-4">
					<div className="flex items-center gap-2 mb-4 text-slate-400">
						<Clock className="w-4 h-4" />
						<span className="text-sm uppercase tracking-wider font-bold">
							Recent Activity
						</span>
					</div>
					<div className="space-y-4">
						<div className="flex justify-between items-center py-3 border-b border-slate-700/50">
							<div className="flex items-center gap-3">
								<div className="bg-green-500/10 p-2 rounded-full">
									<ArrowUpRight className="text-green-500 w-4 h-4" />
								</div>
								<div>
									<p className="text-sm font-medium">Received NXC</p>
									<p className="text-xs text-slate-500">From: 0x82...12a</p>
								</div>
							</div>
							<p className="font-bold text-green-400">+50.00 NXC</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default NXCDashboard
