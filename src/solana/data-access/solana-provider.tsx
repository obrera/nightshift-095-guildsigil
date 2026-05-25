import {
  createSolanaDevnet,
  createSolanaLocalnet,
  createSolanaTestnet,
  createWalletUiConfig,
  WalletUi,
} from '@wallet-ui/react'
import { type ReactNode, useEffect } from 'react'

import { solanaMobileWalletStandard } from './solana-mobile-wallet-standard'

const config = createWalletUiConfig({
  clusters: [
    createSolanaDevnet('https://api.devnet.solana.com'),
    createSolanaLocalnet('http://127.0.0.1:8899'),
    createSolanaTestnet('https://api.testnet.solana.com'),
  ],
})

let solanaMobileWalletStandardLoaded = false

export function SolanaProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (solanaMobileWalletStandardLoaded) {
      return
    }

    solanaMobileWalletStandardLoaded = true
    solanaMobileWalletStandard({ clusters: config.clusters })
  }, [])

  return <WalletUi config={config}>{children}</WalletUi>
}
