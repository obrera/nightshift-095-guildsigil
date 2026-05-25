import type { GuildSigilDraft, GuildSigilStats } from '@/guildsigil/util/guildsigil-model'

import { renderGuildSigilSvg } from '@/guildsigil/util/guildsigil-render'

export function GuildSigilUiPreview({
  draft,
  mediaUri,
  stats,
}: {
  draft: GuildSigilDraft
  mediaUri: string
  stats: GuildSigilStats
}) {
  return (
    <section className="grid gap-4">
      <div
        className="aspect-[16/19] overflow-hidden rounded-lg border border-white/10 bg-black shadow-2xl shadow-black/40"
        dangerouslySetInnerHTML={{ __html: renderGuildSigilSvg(draft) }}
      />
      <div className="grid grid-cols-3 gap-2 text-center">
        <Metric label="Tier" value={stats.accessTier} />
        <Metric label="Raid" value={`+${stats.raidBonus}`} />
        <Metric label="Ready" value={`${stats.readiness}`} />
      </div>
      <a
        className="truncate text-xs text-cyan-200 underline underline-offset-4"
        href={mediaUri}
        rel="noreferrer"
        target="_blank"
      >
        {mediaUri}
      </a>
    </section>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-3">
      <div className="text-[0.65rem] tracking-[0.14em] text-slate-500 uppercase">{label}</div>
      <div className="mt-1 text-sm font-semibold text-slate-100">{value}</div>
    </div>
  )
}
