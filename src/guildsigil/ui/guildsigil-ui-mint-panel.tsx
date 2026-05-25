import { ExternalLink, Hammer, Search } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/core/ui/button'
import { Input } from '@/core/ui/input'
import { SolanaUiWalletDropdown } from '@/solana/ui/solana-ui-wallet-dropdown'

import type { GuildSigilMintResult } from '../data-access/use-guildsigil-mint'

export function GuildSigilUiMintPanel({
  accountAddress,
  isChecking,
  isMinting,
  mediaUri,
  metadataUri,
  mint,
  mintResult,
  verify,
}: {
  accountAddress?: string
  isChecking: boolean
  isMinting: boolean
  mediaUri: string
  metadataUri: string
  mint: () => Promise<GuildSigilMintResult>
  mintResult?: GuildSigilMintResult
  verify: (asset: string) => Promise<void>
}) {
  const [assetInput, setAssetInput] = useState('')

  return (
    <section className="grid gap-4 rounded-lg border border-cyan-300/20 bg-cyan-300/[0.06] p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">Wallet Mint / Verifier</h2>
          <p className="mt-1 text-sm text-slate-400">
            The connected wallet signs the MPL Core devnet asset create transaction.
          </p>
        </div>
        <SolanaUiWalletDropdown className="w-full sm:w-56" />
      </div>
      <div className="grid gap-2 text-sm">
        <UriLine label="Metadata" value={metadataUri} />
        <UriLine label="Image" value={mediaUri} />
        <UriLine label="Owner" value={accountAddress ?? 'Connect wallet'} />
      </div>
      <Button
        className="gap-2"
        disabled={!accountAddress || isMinting}
        onClick={() => {
          void mint().catch((error: unknown) => {
            toast.error('Mint failed', { description: error instanceof Error ? error.message : 'Unknown error' })
          })
        }}
      >
        <Hammer className="size-4" />
        {isMinting ? 'Minting guild sigil...' : 'Mint with connected wallet'}
      </Button>
      {mintResult ? (
        <div className="grid gap-2 rounded-md border border-emerald-300/25 bg-emerald-300/10 p-3 text-sm text-emerald-50">
          <UriLine label="Asset" value={mintResult.asset} />
          <UriLine label="Signature" value={mintResult.signature} />
          <a
            className="inline-flex items-center gap-2 text-emerald-100 underline underline-offset-4"
            href={`https://explorer.solana.com/address/${mintResult.asset}?cluster=devnet`}
            rel="noreferrer"
            target="_blank"
          >
            <ExternalLink className="size-4" />
            View asset on explorer
          </a>
        </div>
      ) : null}
      <div className="flex flex-col gap-2 sm:flex-row">
        <Input
          onChange={(event) => setAssetInput(event.target.value)}
          placeholder="MPL Core asset address"
          value={assetInput}
        />
        <Button
          className="gap-2"
          disabled={isChecking || !assetInput.trim()}
          onClick={() => {
            void verify(assetInput.trim())
          }}
          type="button"
          variant="outline"
        >
          <Search className="size-4" />
          Verify
        </Button>
      </div>
    </section>
  )
}

function UriLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1 rounded-md border border-white/10 bg-black/20 p-2">
      <span className="text-xs tracking-[0.14em] text-slate-500 uppercase">{label}</span>
      <span className="truncate font-mono text-xs text-slate-200">{value}</span>
    </div>
  )
}
