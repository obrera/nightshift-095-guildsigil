import { useGuildSigilDraft } from '../data-access/use-guildsigil-draft'
import { GuildSigilUiComposer } from '../ui/guildsigil-ui-composer'
import { GuildSigilUiOperator } from '../ui/guildsigil-ui-operator'
import { GuildSigilUiPreview } from '../ui/guildsigil-ui-preview'
import { GuildSigilUiReadiness } from '../ui/guildsigil-ui-readiness'
import { GuildSigilFeatureMint } from './guildsigil-feature-mint'

export function GuildSigilFeatureHome() {
  const { draft, mediaUri, metadataUri, setDraft, stats } = useGuildSigilDraft()

  return (
    <main className="min-h-screen bg-[#07080d] text-slate-100">
      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[1fr_420px] lg:px-6">
        <div className="grid gap-6">
          <div className="rounded-lg border border-white/10 bg-[radial-gradient(circle_at_20%_0%,rgba(34,211,238,0.18),transparent_32%),linear-gradient(135deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))] p-5">
            <p className="text-sm font-semibold tracking-[0.16em] text-cyan-200 uppercase">
              Nightshift 095 · GuildSigil
            </p>
            <h1 className="mt-3 max-w-3xl text-4xl font-black tracking-normal text-white sm:text-5xl">
              Forge a playable guild banner for Solana game rooms.
            </h1>
            <p className="mt-4 max-w-2xl text-base text-slate-300">
              Compose a squad identity NFT with role slots, holder-verifiable access tier, raid bonuses, and SVG
              metadata hosted by this app.
            </p>
          </div>
          <div className="lg:hidden">
            <GuildSigilUiPreview draft={draft} mediaUri={mediaUri} stats={stats} />
          </div>
          <GuildSigilUiComposer draft={draft} setDraft={setDraft} />
          <GuildSigilUiReadiness stats={stats} />
          <GuildSigilFeatureMint mediaUri={mediaUri} metadataUri={metadataUri} stats={stats} />
          <GuildSigilUiOperator draft={draft} stats={stats} />
        </div>
        <aside className="hidden lg:sticky lg:top-6 lg:block lg:self-start">
          <GuildSigilUiPreview draft={draft} mediaUri={mediaUri} stats={stats} />
        </aside>
      </section>
    </main>
  )
}

export { GuildSigilFeatureHome as Component }
