import type { ReactNode } from 'react'

import { Gauge, PackageCheck } from 'lucide-react'

import type { GuildSigilDraft, GuildSigilStats } from '@/guildsigil/util/guildsigil-model'

export function GuildSigilUiOperator({ draft, stats }: { draft: GuildSigilDraft; stats: GuildSigilStats }) {
  const minted = Math.round(draft.supplyCap * 0.37)
  const remaining = draft.supplyCap - minted
  const pressure = Math.round((minted / draft.supplyCap) * 100)

  return (
    <section className="grid gap-4 rounded-lg border border-white/10 bg-white/[0.04] p-4">
      <div>
        <h2 className="text-lg font-semibold text-white">Creator Drop Console</h2>
        <p className="mt-1 text-sm text-slate-400">
          Season readiness controls for a game team shipping a guild-banner drop.
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <ConsoleMetric icon={<PackageCheck className="size-4" />} label="Supply ready" value={`${remaining} left`} />
        <ConsoleMetric icon={<Gauge className="size-4" />} label="Mint pressure" value={`${pressure}%`} />
        <ConsoleMetric icon={<PackageCheck className="size-4" />} label="Gate tier" value={stats.accessTier} />
      </div>
      <div className="grid gap-2 text-sm">
        <ReadinessLine label="Metadata route" ready />
        <ReadinessLine label="SVG media route" ready />
        <ReadinessLine label="Wallet-signed MPL Core mint" ready />
        <ReadinessLine label="Manual destination override" ready={false} />
      </div>
    </section>
  )
}

function ConsoleMetric({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-md border border-white/10 bg-black/20 p-3">
      <div className="flex items-center gap-2 text-xs tracking-[0.14em] text-slate-500 uppercase">
        {icon}
        {label}
      </div>
      <div className="mt-2 text-lg font-semibold text-white">{value}</div>
    </div>
  )
}

function ReadinessLine({ label, ready }: { label: string; ready: boolean }) {
  return (
    <div className="flex items-center justify-between rounded-md border border-white/10 bg-black/20 px-3 py-2">
      <span className="text-slate-300">{label}</span>
      <span className={ready ? 'text-emerald-300' : 'text-slate-500'}>{ready ? 'ready' : 'blocked by design'}</span>
    </div>
  )
}
