import { validateMnemonic } from './validateMnemonic'
import bip39 from 'bip39'
import BIP32Factory from 'bip32'
import * as ecc from 'tiny-secp256k1'
import { bytesToHex } from 'nexchain/backup/lib/bytesToHex'

const bip32 = BIP32Factory(ecc)
// Fungsi untuk menghasilkan kunci dari mnemonic
export const generateKeysFromMnemonic = (mnemonic: string) => {
	validateMnemonic(mnemonic)

	const seed = bip39.mnemonicToSeedSync(mnemonic)
	const masterNode = bip32.fromSeed(seed)
	const childNode = masterNode.derivePath("m/44'/60'/0'/0/0")

	const privateKey = bytesToHex(childNode.privateKey!)
	const publicKey = bytesToHex(childNode.publicKey)

	return { privateKey: `0x${privateKey}`, publicKey: `0x${publicKey}` }
}
