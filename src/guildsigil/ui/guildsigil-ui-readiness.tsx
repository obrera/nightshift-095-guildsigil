import { AlertTriangle, CheckCircle2 } from 'lucide-react'

import type { GuildSigilStats } from '@/guildsigil/util/guildsigil-model'

export function GuildSigilUiReadiness({ stats }: { stats: GuildSigilStats }) {
  return (
    <section className="grid gap-4 rounded-lg border border-white/10 bg-white/[0.04] p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-white">Game Utility</h2>
          <p className="mt-1 text-sm text-slate-400">Access and compatibility generated from the banner traits.</p>
        </div>
        <span className="rounded-md bg-cyan-300 px-2 py-1 text-xs font-bold text-slate-950">{stats.synergy}</span>
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat label="Defense" value={stats.defense} />
        <Stat label="Raid bonus" value={`+${stats.raidBonus}`} />
        <Stat label="Rarity" value={stats.rarityScore} />
        <Stat label="Attributes" value={stats.attributeCount} />
      </div>
      <div className="grid gap-2">
        {stats.compatibilityWarnings.length ? (
          stats.compatibilityWarnings.map((warning) => (
            <div
              className="flex gap-2 rounded-md border border-amber-300/30 bg-amber-300/10 p-3 text-sm text-amber-100"
              key={warning}
            >
              <AlertTriangle className="mt-0.5 size-4 shrink-0" />
              {warning}
            </div>
          ))
        ) : (
          <div className="flex gap-2 rounded-md border border-emerald-300/30 bg-emerald-300/10 p-3 text-sm text-emerald-100">
            <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
            Compatible for squad identity, holder verification, and raid-room access.
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {stats.metadataAttributes.map((attribute) => (
          <div className="rounded-md border border-white/10 bg-black/20 p-3" key={attribute.trait_type}>
            <div className="text-xs tracking-[0.14em] text-slate-500 uppercase">{attribute.trait_type}</div>
            <div className="mt-1 text-sm text-slate-100">{attribute.value}</div>
          </div>
        ))}
      </div>
    </section>
  )
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-md border border-white/10 bg-black/20 p-3">
      <div className="text-xs tracking-[0.14em] text-slate-500 uppercase">{label}</div>
      <div className="mt-1 text-xl font-semibold text-white">{value}</div>
    </div>
  )
}
