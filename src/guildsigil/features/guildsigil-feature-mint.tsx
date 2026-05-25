import { useWalletUi } from '@wallet-ui/react'
import { useState } from 'react'
import { toast } from 'sonner'

import { useSolanaClient } from '@/solana/data-access/use-solana-client'

import type { GuildSigilStats } from '../util/guildsigil-model'

import { type GuildSigilMintResult, useGuildSigilMint } from '../data-access/use-guildsigil-mint'
import { useGuildSigilVerifier } from '../data-access/use-guildsigil-verifier'
import { GuildSigilUiMintPanel } from '../ui/guildsigil-ui-mint-panel'

export function GuildSigilFeatureMint({
  mediaUri,
  metadataUri,
  stats,
}: {
  mediaUri: string
  metadataUri: string
  stats: GuildSigilStats
}) {
  const { account } = useWalletUi()
  const client = useSolanaClient()
  const verifier = useGuildSigilVerifier({ client })
  const [mintResult, setMintResult] = useState<GuildSigilMintResult>()

  if (account) {
    return (
      <GuildSigilFeatureMintConnected
        account={account}
        mediaUri={mediaUri}
        metadataUri={metadataUri}
        mintResult={mintResult}
        setMintResult={setMintResult}
        stats={stats}
        verifier={verifier}
      />
    )
  }

  return (
    <GuildSigilUiMintPanel
      accountAddress={undefined}
      isChecking={verifier.isChecking}
      isMinting={false}
      mediaUri={mediaUri}
      metadataUri={metadataUri}
      mint={async () => {
        throw new Error('Connect a wallet before minting.')
      }}
      mintResult={mintResult}
      verify={async (asset) => {
        try {
          const result = await verifier.verifyAsset(asset)
          toast.success('Asset verified', { description: `${result.name} · ${result.owner}` })
        } catch (error) {
          toast.error('Verifier failed', { description: error instanceof Error ? error.message : 'Unknown error' })
        }
      }}
    />
  )
}

function GuildSigilFeatureMintConnected({
  account,
  mediaUri,
  metadataUri,
  mintResult,
  setMintResult,
  stats,
  verifier,
}: {
  account: NonNullable<ReturnType<typeof useWalletUi>['account']>
  mediaUri: string
  metadataUri: string
  mintResult?: GuildSigilMintResult
  setMintResult: (result: GuildSigilMintResult) => void
  stats: GuildSigilStats
  verifier: ReturnType<typeof useGuildSigilVerifier>
}) {
  const client = useSolanaClient()
  const mintState = useGuildSigilMint({ account, client })

  return (
    <GuildSigilUiMintPanel
      accountAddress={account.address}
      isChecking={verifier.isChecking}
      isMinting={mintState.isMinting}
      mediaUri={mediaUri}
      metadataUri={metadataUri}
      mint={async () => {
        const result = await mintState.mintGuildSigil({ metadataUri, name: stats.generatedName })
        setMintResult(result)
        toast.success('Guild sigil minted', { description: result.asset })
        return result
      }}
      mintResult={mintResult}
      verify={async (asset) => {
        try {
          const result = await verifier.verifyAsset(asset)
          toast.success('Asset verified', { description: `${result.name} · ${result.owner}` })
        } catch (error) {
          toast.error('Verifier failed', { description: error instanceof Error ? error.message : 'Unknown error' })
        }
      }}
    />
  )
}
