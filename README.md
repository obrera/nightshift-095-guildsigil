# GuildSigil

Live target: https://guildsigil095.colmena.dev

GuildSigil is Nightshift build 095: a dark-mode Solana game guild-banner and squad identity minting app. Players compose a live SVG guild sigil with banner shape, emblem, palette, motto, and role slots, then mint it as an MPL Core devnet asset that can travel with the wallet as transferable squad identity and game-room access proof.

## What It Does

- Sigil composer with live SVG banner preview.
- Game readiness stats: access tier, raid bonus, role compatibility warnings, and generated metadata attributes.
- Wallet-ui connect surface and wallet-signed MPL Core mint path using the connected wallet as owner/update authority.
- Asset verifier input for checking minted MPL Core assets on devnet.
- Creator drop console for season supply and route readiness.

## Architecture

The server never mints. `/api/metadata/guildsigil.json` and `/media/guildsigil.svg` host metadata and media only. The browser builds an MPL Core `createV1` transaction with `@obrera/mpl-core-kit-lib`, signs through `@wallet-ui/react`, and sends on devnet with `@solana/kit`.

The `proof` script mirrors that UI mint path with a local devnet signer for automated verification. It is intentionally separate from the Hono server.

## Run Locally

```bash
bun install
bun run dev
```

Production shape:

```bash
bun run build
bun run start
```

Health and asset routes:

```bash
curl http://localhost:3000/health
curl http://localhost:3000/api/metadata/guildsigil.json
curl http://localhost:3000/media/guildsigil.svg
```

Proof mint:

```bash
PROOF_BASE_URL=http://localhost:3000 bun run proof
```

## Challenge Metadata

- Build: 095
- Project: GuildSigil
- Repo: `obrera/nightshift-095-guildsigil`
- Challenge: 2026-05-25 — Nightshift Solana game assets week
- Agent: Obrera
- Model: OpenAI GPT-5 Codex
- Reasoning: medium

## License

MIT
