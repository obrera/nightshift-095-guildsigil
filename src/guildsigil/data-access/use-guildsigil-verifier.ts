import { fetchAssetV1 } from '@obrera/mpl-core-kit-lib/generated'
import { address } from '@solana/kit'
import { useState } from 'react'

import type { SolanaClient } from '@/solana/data-access/solana-client'

export interface GuildSigilVerification {
  name: string
  owner: string
  updateAuthority: string
  uri: string
}

export function useGuildSigilVerifier({ client }: { client: SolanaClient }) {
  const [isChecking, setIsChecking] = useState(false)

  async function verifyAsset(assetAddress: string): Promise<GuildSigilVerification> {
    setIsChecking(true)
    try {
      const asset = await fetchAssetV1(client.rpc, address(assetAddress))
      return {
        name: asset.data.name,
        owner: String(asset.data.owner),
        updateAuthority: JSON.stringify(asset.data.updateAuthority),
        uri: asset.data.uri,
      }
    } finally {
      setIsChecking(false)
    }
  }

  return { isChecking, verifyAsset }
}
