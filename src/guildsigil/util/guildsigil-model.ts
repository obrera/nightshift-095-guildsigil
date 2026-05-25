export type BannerShape = 'kite' | 'standard' | 'warflag'
export type Emblem = 'phoenix' | 'sentinel' | 'stormeye' | 'voidblade'
export interface GuildSigilDraft {
  emblem: Emblem
  motto: string
  palette: Palette
  roles: SquadRole[]
  season: string
  shape: BannerShape
  supplyCap: number
}
export interface GuildSigilStats {
  accessTier: 'Mythic Raid' | 'Raid' | 'Skirmish'
  attributeCount: number
  compatibilityWarnings: string[]
  defense: number
  generatedName: string
  metadataAttributes: Array<{ trait_type: string; value: number | string }>
  raidBonus: number
  rarityScore: number
  readiness: number
  synergy: string
}

export type Palette = 'arcane' | 'ember' | 'frost' | 'verdant'

export type SquadRole = 'caller' | 'mender' | 'scout' | 'striker' | 'vanguard' | 'warden'

export const bannerShapes: Array<{ id: BannerShape; label: string; text: string }> = [
  { id: 'kite', label: 'Kite pennant', text: 'mobile squads' },
  { id: 'standard', label: 'Fortress standard', text: 'room control' },
  { id: 'warflag', label: 'War flag', text: 'raid pushes' },
]

export const emblems: Array<{ id: Emblem; label: string; text: string }> = [
  { id: 'phoenix', label: 'Ash phoenix', text: 'revive tempo' },
  { id: 'sentinel', label: 'Iron sentinel', text: 'frontline hold' },
  { id: 'voidblade', label: 'Void blade', text: 'burst breach' },
  { id: 'stormeye', label: 'Storm eye', text: 'map control' },
]

export const palettes: Record<Palette, { accent: string; base: string; glow: string; label: string; trim: string }> = {
  arcane: { accent: '#9d7cff', base: '#21183c', glow: '#58d7ff', label: 'Arcane violet', trim: '#f5d572' },
  ember: { accent: '#ff6b3d', base: '#2b1115', glow: '#ffd166', label: 'Ember crimson', trim: '#f7efe0' },
  frost: { accent: '#62d5ff', base: '#102236', glow: '#d7fbff', label: 'Frost signal', trim: '#9df7c8' },
  verdant: { accent: '#4ade80', base: '#10251c', glow: '#f7d35c', label: 'Verdant oath', trim: '#d8f99d' },
}

export const squadRoles: Array<{
  id: SquadRole
  label: string
  stat: keyof Pick<GuildSigilStats, 'defense' | 'raidBonus'>
}> = [
  { id: 'vanguard', label: 'Vanguard', stat: 'defense' },
  { id: 'striker', label: 'Striker', stat: 'raidBonus' },
  { id: 'warden', label: 'Warden', stat: 'defense' },
  { id: 'scout', label: 'Scout', stat: 'raidBonus' },
  { id: 'mender', label: 'Mender', stat: 'defense' },
  { id: 'caller', label: 'Caller', stat: 'raidBonus' },
]

export const defaultGuildSigilDraft: GuildSigilDraft = {
  emblem: 'phoenix',
  motto: 'Hold the room',
  palette: 'ember',
  roles: ['vanguard', 'striker', 'caller'],
  season: 'Nightfall Season 095',
  shape: 'warflag',
  supplyCap: 512,
}

export function calculateGuildSigilStats(draftInput: GuildSigilDraft): GuildSigilStats {
  const draft = normalizeDraft(draftInput)
  const roleSet = new Set(draft.roles)
  const defense =
    18 + (roleSet.has('vanguard') ? 18 : 0) + (roleSet.has('warden') ? 16 : 0) + (roleSet.has('mender') ? 9 : 0)
  const raidBonus =
    12 + (roleSet.has('striker') ? 20 : 0) + (roleSet.has('scout') ? 12 : 0) + (roleSet.has('caller') ? 15 : 0)
  const spread = roleSet.size * 9
  const rarityScore = clamp(
    42 + spread + (draft.shape === 'warflag' ? 9 : 0) + (draft.emblem === 'voidblade' ? 8 : 0),
    1,
    100,
  )
  const warnings = getCompatibilityWarnings(draft)
  const readiness = clamp(Math.round((defense + raidBonus + rarityScore) / 3 - warnings.length * 8), 1, 100)
  const accessTier = readiness >= 82 && roleSet.has('caller') ? 'Mythic Raid' : readiness >= 58 ? 'Raid' : 'Skirmish'
  const generatedName = `${capitalize(draft.palette)} ${capitalize(draft.emblem)} ${draft.shape === 'standard' ? 'Standard' : 'Sigil'}`
  const synergy =
    roleSet.has('vanguard') && roleSet.has('caller')
      ? 'Anchor-call engage'
      : roleSet.has('scout')
        ? 'Fast map breach'
        : 'Room hold'
  const metadataAttributes = [
    { trait_type: 'Banner Shape', value: labelFor(bannerShapes, draft.shape) },
    { trait_type: 'Emblem', value: labelFor(emblems, draft.emblem) },
    { trait_type: 'Palette', value: palettes[draft.palette].label },
    { trait_type: 'Motto', value: draft.motto },
    { trait_type: 'Role Slots', value: draft.roles.map((role) => labelFor(squadRoles, role)).join(', ') },
    { trait_type: 'Access Tier', value: accessTier },
    { trait_type: 'Raid Bonus', value: raidBonus },
    { trait_type: 'Readiness', value: readiness },
    { trait_type: 'Season', value: draft.season },
  ]

  return {
    accessTier,
    attributeCount: metadataAttributes.length,
    compatibilityWarnings: warnings,
    defense,
    generatedName,
    metadataAttributes,
    raidBonus,
    rarityScore,
    readiness,
    synergy,
  }
}

export function draftFromSearchParams(params: URLSearchParams): GuildSigilDraft {
  return normalizeDraft({
    emblem: (params.get('emblem') ?? undefined) as Emblem | undefined,
    motto: params.get('motto') ?? undefined,
    palette: (params.get('palette') ?? undefined) as Palette | undefined,
    roles: (params.get('roles')?.split(',') ?? []) as SquadRole[],
    season: params.get('season') ?? undefined,
    shape: (params.get('shape') ?? undefined) as BannerShape | undefined,
    supplyCap: Number(params.get('supply') ?? defaultGuildSigilDraft.supplyCap),
  })
}

export function draftToSearchParams(draftInput: GuildSigilDraft) {
  const draft = normalizeDraft(draftInput)
  const params = new URLSearchParams()
  params.set('shape', draft.shape)
  params.set('emblem', draft.emblem)
  params.set('palette', draft.palette)
  params.set('motto', draft.motto)
  params.set('roles', draft.roles.join(','))
  params.set('season', draft.season)
  params.set('supply', String(draft.supplyCap))
  return params.toString()
}

export function normalizeDraft(input: Partial<GuildSigilDraft>): GuildSigilDraft {
  const roles = input.roles?.filter(
    (role, index, list) => squadRoles.some((item) => item.id === role) && list.indexOf(role) === index,
  )
  const emblem =
    input.emblem && emblems.some((item) => item.id === input.emblem) ? input.emblem : defaultGuildSigilDraft.emblem
  const palette =
    input.palette && Object.hasOwn(palettes, input.palette) ? input.palette : defaultGuildSigilDraft.palette
  const shape =
    input.shape && bannerShapes.some((item) => item.id === input.shape) ? input.shape : defaultGuildSigilDraft.shape

  return {
    emblem,
    motto: sanitizeMotto(input.motto ?? defaultGuildSigilDraft.motto),
    palette,
    roles: roles?.length ? roles.slice(0, 4) : defaultGuildSigilDraft.roles,
    season: input.season?.trim().slice(0, 48) || defaultGuildSigilDraft.season,
    shape,
    supplyCap: clamp(Math.round(input.supplyCap ?? defaultGuildSigilDraft.supplyCap), 64, 4096),
  }
}

function capitalize(value: string) {
  return value.slice(0, 1).toUpperCase() + value.slice(1)
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function getCompatibilityWarnings(draft: GuildSigilDraft) {
  const warnings: string[] = []
  const roleSet = new Set(draft.roles)
  if (draft.roles.length < 3) warnings.push('Add at least three role slots before raid-room access.')
  if (draft.shape === 'warflag' && !roleSet.has('caller'))
    warnings.push('War flags need a Caller slot for coordinated gate opens.')
  if (draft.emblem === 'voidblade' && !roleSet.has('mender'))
    warnings.push('Void blade squads should carry a Mender for recovery windows.')
  if (draft.supplyCap > 2048 && draft.palette === 'arcane')
    warnings.push('Arcane drops above 2048 supply dilute mythic-room matching.')
  return warnings
}

function labelFor<T extends string>(items: Array<{ id: T; label: string }>, id: T) {
  return items.find((item) => item.id === id)?.label ?? id
}

function sanitizeMotto(value: string) {
  return value.replace(/[<>]/g, '').trim().slice(0, 42) || defaultGuildSigilDraft.motto
}
