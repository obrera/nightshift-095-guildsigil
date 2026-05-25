import { calculateGuildSigilStats, type GuildSigilDraft, normalizeDraft, palettes } from './guildsigil-model'

export function createGuildSigilMetadata(draftInput: GuildSigilDraft, baseUrl: string) {
  const draft = normalizeDraft(draftInput)
  const stats = calculateGuildSigilStats(draft)
  const query = new URLSearchParams({
    emblem: draft.emblem,
    motto: draft.motto,
    palette: draft.palette,
    roles: draft.roles.join(','),
    season: draft.season,
    shape: draft.shape,
    supply: String(draft.supplyCap),
  }).toString()
  const cleanBase = baseUrl.replace(/\/$/, '')

  return {
    attributes: stats.metadataAttributes,
    description:
      'GuildSigil is a transferable Solana game guild banner NFT for squad identity, room access, and raid-role compatibility.',
    external_url: `${cleanBase}/`,
    image: `${cleanBase}/media/guildsigil.svg?${query}`,
    name: stats.generatedName,
    properties: {
      category: 'image',
      creators: [{ address: 'GuildSigil095', share: 100 }],
      files: [{ type: 'image/svg+xml', uri: `${cleanBase}/media/guildsigil.svg?${query}` }],
    },
    symbol: 'SIGIL095',
  }
}

export function renderGuildSigilSvg(draftInput: GuildSigilDraft) {
  const draft = normalizeDraft(draftInput)
  const stats = calculateGuildSigilStats(draft)
  const palette = palettes[draft.palette]
  const path = getBannerPath(draft.shape)
  const emblem = renderEmblem(draft.emblem, palette.trim, palette.glow)
  const roles = draft.roles
    .map(
      (role, index) =>
        `<circle cx="${164 + index * 42}" cy="558" r="13" fill="${palette.glow}"><title>${escapeXml(role)}</title></circle>`,
    )
    .join('')

  return `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="760" viewBox="0 0 640 760" role="img" aria-label="${escapeXml(stats.generatedName)}">
  <defs>
    <linearGradient id="cloth" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0" stop-color="${palette.accent}"/>
      <stop offset="0.52" stop-color="${palette.base}"/>
      <stop offset="1" stop-color="#05060a"/>
    </linearGradient>
    <filter id="glow"><feGaussianBlur stdDeviation="7" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  </defs>
  <rect width="640" height="760" fill="#07080d"/>
  <circle cx="320" cy="244" r="230" fill="${palette.accent}" opacity="0.12"/>
  <path d="${path}" fill="url(#cloth)" stroke="${palette.trim}" stroke-width="8"/>
  <path d="${path}" fill="none" stroke="${palette.glow}" stroke-width="2" opacity="0.75"/>
  <line x1="114" x2="526" y1="94" y2="94" stroke="${palette.trim}" stroke-width="12" stroke-linecap="round"/>
  <g filter="url(#glow)">${emblem}</g>
  <text x="320" y="486" fill="${palette.trim}" font-family="Verdana, sans-serif" font-size="30" text-anchor="middle" font-weight="700">${escapeXml(stats.accessTier)}</text>
  <text x="320" y="524" fill="#f8fafc" font-family="Verdana, sans-serif" font-size="22" text-anchor="middle">${escapeXml(draft.motto)}</text>
  <g>${roles}</g>
  <text x="320" y="600" fill="${palette.trim}" font-family="Verdana, sans-serif" font-size="18" text-anchor="middle">Readiness ${stats.readiness} / Raid +${stats.raidBonus}</text>
  <text x="320" y="704" fill="#b9c4d0" font-family="Verdana, sans-serif" font-size="18" text-anchor="middle">${escapeXml(draft.season)} · GuildSigil 095</text>
</svg>`
}

function escapeXml(value: string) {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;')
}

function getBannerPath(shape: GuildSigilDraft['shape']) {
  if (shape === 'kite') return 'M172 96 H468 V452 L320 610 L172 452 Z'
  if (shape === 'standard') return 'M148 96 H492 V590 L416 536 L320 596 L224 536 L148 590 Z'
  return 'M132 96 H508 V540 L436 500 L364 560 L292 500 L220 560 L132 512 Z'
}

function renderEmblem(emblem: GuildSigilDraft['emblem'], trim: string, glow: string) {
  if (emblem === 'sentinel') {
    return `<path d="M320 150 L430 208 V286 C430 356 384 410 320 436 C256 410 210 356 210 286 V208 Z" fill="none" stroke="${trim}" stroke-width="18"/><path d="M282 276 H358 M320 204 V398" stroke="${glow}" stroke-width="16" stroke-linecap="round"/>`
  }
  if (emblem === 'voidblade') {
    return `<path d="M320 136 L370 278 L320 438 L270 278 Z" fill="${trim}"/><path d="M238 246 L402 330 M402 246 L238 330" stroke="${glow}" stroke-width="14" stroke-linecap="round"/>`
  }
  if (emblem === 'stormeye') {
    return `<ellipse cx="320" cy="286" rx="132" ry="74" fill="none" stroke="${trim}" stroke-width="16"/><circle cx="320" cy="286" r="42" fill="${glow}"/><path d="M230 180 C292 132 382 136 430 198 M214 392 C286 444 374 444 428 380" stroke="${glow}" stroke-width="12" fill="none" stroke-linecap="round"/>`
  }
  return `<path d="M320 132 C390 198 426 256 404 344 C372 302 344 298 320 438 C296 298 268 302 236 344 C214 256 250 198 320 132 Z" fill="${trim}"/><path d="M260 258 C294 248 304 218 320 184 C336 218 346 248 380 258" stroke="${glow}" stroke-width="14" fill="none" stroke-linecap="round"/>`
}
