import { Shield, Swords } from 'lucide-react'

import { Button } from '@/core/ui/button'
import { Input } from '@/core/ui/input'
import { Label } from '@/core/ui/label'
import { Slider } from '@/core/ui/slider'
import {
  bannerShapes,
  emblems,
  type GuildSigilDraft,
  normalizeDraft,
  palettes,
  type SquadRole,
  squadRoles,
} from '@/guildsigil/util/guildsigil-model'

export function GuildSigilUiComposer({
  draft,
  setDraft,
}: {
  draft: GuildSigilDraft
  setDraft: (draft: GuildSigilDraft) => void
}) {
  function patchDraft(patch: Partial<GuildSigilDraft>) {
    setDraft(normalizeDraft({ ...draft, ...patch }))
  }

  function toggleRole(role: SquadRole) {
    const roles = draft.roles.includes(role) ? draft.roles.filter((item) => item !== role) : [...draft.roles, role]
    patchDraft({ roles })
  }

  return (
    <section className="grid gap-5">
      <div>
        <h2 className="text-lg font-semibold text-white">Sigil Composer</h2>
        <p className="mt-1 text-sm text-slate-400">Compose the squad banner players carry into room gates and raids.</p>
      </div>

      <ChoiceGrid
        label="Banner shape"
        onPick={(shape) => patchDraft({ shape })}
        options={bannerShapes}
        value={draft.shape}
      />
      <ChoiceGrid label="Emblem" onPick={(emblem) => patchDraft({ emblem })} options={emblems} value={draft.emblem} />

      <div className="grid gap-2">
        <Label>Palette</Label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {Object.entries(palettes).map(([id, palette]) => (
            <button
              className={`rounded-md border p-3 text-left text-sm transition ${
                draft.palette === id
                  ? 'border-cyan-300 bg-cyan-300/10 text-white'
                  : 'border-white/10 bg-white/[0.03] text-slate-300'
              }`}
              key={id}
              onClick={() => patchDraft({ palette: id as GuildSigilDraft['palette'] })}
              type="button"
            >
              <span className="mb-3 flex gap-1">
                {[palette.base, palette.accent, palette.trim].map((color) => (
                  <span
                    className="h-5 w-5 rounded-full border border-white/20"
                    key={color}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </span>
              {palette.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="motto">Motto / war cry</Label>
        <Input
          id="motto"
          maxLength={42}
          onChange={(event) => patchDraft({ motto: event.target.value })}
          value={draft.motto}
        />
      </div>

      <div className="grid gap-2">
        <Label>Squad role slots</Label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {squadRoles.map((role) => (
            <Button
              className="justify-start gap-2"
              key={role.id}
              onClick={() => toggleRole(role.id)}
              type="button"
              variant={draft.roles.includes(role.id) ? 'default' : 'outline'}
            >
              {role.stat === 'defense' ? <Shield className="size-4" /> : <Swords className="size-4" />}
              {role.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid gap-2">
        <div className="flex items-center justify-between">
          <Label>Drop supply cap</Label>
          <span className="text-sm text-slate-300">{draft.supplyCap}</span>
        </div>
        <Slider
          max={4096}
          min={64}
          onValueChange={(value) => patchDraft({ supplyCap: Array.isArray(value) ? value[0] : value })}
          step={64}
          value={[draft.supplyCap]}
        />
      </div>
    </section>
  )
}

function ChoiceGrid<T extends string>({
  label,
  onPick,
  options,
  value,
}: {
  label: string
  onPick: (value: T) => void
  options: Array<{ id: T; label: string; text: string }>
  value: T
}) {
  return (
    <div className="grid gap-2">
      <Label>{label}</Label>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        {options.map((option) => (
          <button
            className={`rounded-md border p-3 text-left transition ${
              value === option.id ? 'border-cyan-300 bg-cyan-300/10' : 'border-white/10 bg-white/[0.03]'
            }`}
            key={option.id}
            onClick={() => onPick(option.id)}
            type="button"
          >
            <span className="block text-sm font-semibold text-white">{option.label}</span>
            <span className="mt-1 block text-xs text-slate-400">{option.text}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
