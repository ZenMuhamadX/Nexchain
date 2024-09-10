import { createWalletAddress } from '../../lib/wallet/createWallet'

export const processMessage = (message: string): any => {
  if (message === 'wallet') {
    return createWalletAddress()
  }
}
