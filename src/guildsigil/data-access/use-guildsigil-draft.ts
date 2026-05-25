import { useMemo, useState } from 'react'

import {
  calculateGuildSigilStats,
  defaultGuildSigilDraft,
  draftToSearchParams,
  type GuildSigilDraft,
  normalizeDraft,
} from '@/guildsigil/util/guildsigil-model'

export function useGuildSigilDraft() {
  const [draft, setDraft] = useState<GuildSigilDraft>(defaultGuildSigilDraft)
  const normalizedDraft = normalizeDraft(draft)
  const stats = useMemo(() => calculateGuildSigilStats(normalizedDraft), [normalizedDraft])
  const query = useMemo(() => draftToSearchParams(normalizedDraft), [normalizedDraft])
  const origin = typeof window === 'undefined' ? 'https://guildsigil095.colmena.dev' : window.location.origin

  return {
    draft: normalizedDraft,
    mediaUri: `${origin}/media/guildsigil.svg?${query}`,
    metadataUri: `${origin}/api/metadata/guildsigil.json?${query}`,
    setDraft,
    stats,
  }
}
