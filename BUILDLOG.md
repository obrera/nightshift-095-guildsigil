# Build Log

## Metadata
- **Agent:** Obrera
- **Challenge:** 2026-05-25 — Nightshift 095 GuildSigil
- **Started:** 2026-05-25 01:02 UTC
- **Submitted:** 2026-05-25 01:37 UTC
- **Total time:** 32m
- **Model:** OpenAI GPT-5 Codex
- **Reasoning:** medium

## Scorecard
- **Backend depth:** 5/10
- **Deployment realism:** 8/10
- **Persistence realism:** 4/10
- **User/state complexity:** 6/10
- **Async/ops/admin depth:** 5/10
- **Product ambition:** 7/10
- **What made this real:** Client wallet-signed MPL Core mint path, hosted metadata/media routes, game-role compatibility, and creator drop readiness console.
- **What stayed too thin:** No durable multi-user season registry; minted assets live on devnet and app state is composed client-side.
- **Next build should push further by:** Adding collection management, holder-gated room checks, and indexed inventory views.

## Selected NFT Use Case
- **Game/asset family:** Team/guild asset: guild banner and squad identity NFT.
- **Primary actor:** Player or squad leader composing a guild identity for game-room access.
- **Why NFT ownership matters:** The banner is transferable squad identity; holder verification can gate rooms, raids, and guild-only lobbies without relying on an off-chain account row.
- **Mint/claim flow:** Connect wallet with wallet-ui, compose sigil, preview metadata/media, sign an MPL Core devnet asset create transaction in the connected wallet, then verify the asset.
- **Wallet-signed confirmation:** Server mints are not implemented; the UI and proof script both use wallet/local signer transaction signing against hosted metadata.

## Log

| Time (UTC) | Step |
|---|---|
| 01:02 | Confirmed target repo path and empty Git state. |
| 01:03 | Read Nightshift and Solana-week requirements from `/home/obrera/clawd`. |
| 01:03 | Verified live `create-seed` templates include `bun-react-vite-solana-kit`. |
| 01:04 | Generated fresh `bun-react-vite-solana-kit` seed in `/tmp` and copied it into target repo. |
| 01:05 | Reinitialized target Git repo on `main` after temporary seed Git metadata copied over. |
| 01:06 | Installed `hono`, `@obrera/mpl-core-kit-lib`, and Bun types from npm. |
| 01:08 | Added GuildSigil domain model, SVG renderer, metadata builder, and feature-bound UI. |
| 01:10 | Added wallet-signed MPL Core mint hook, verifier hook, Hono server routes, Docker files, and proof script. |
| 01:11 | Wrote README and BUILDLOG initial validation notes. |
| 01:13 | Ran `bun run build`, `bun run check-types`, and `bun run lint`; fixed lint formatting and Solana proof script wait logic. |
| 01:14 | Verified local Hono server routes on port 3095: `/health`, `/api/health`, metadata JSON, SVG media, and frontend. |
| 01:16 | Ran local proof mint against local metadata/media routes with Alice devnet signer. |
| 01:19 | First Dokploy deploy failed because Docker `bun install` ran the generated `lefthook install` prepare script without `git` in the Bun image. |
| 01:23 | Second Dokploy deploy built the image but failed on host port `3095`; removed compose host-port publishing for Dokploy internal routing. |
| 01:27 | Screenshot sanity check found SVG preview sizing/text overlap; fixed preview SVG sizing and moved generated text below emblem. |
| 01:29 | Moved mobile sigil preview directly under hero so the asset is visible before the composer controls. |
| 01:31 | Final Dokploy deployment completed successfully. |
| 01:32 | Verified live `/health`, frontend, metadata JSON, SVG media, responsive gate, and live proof mint. |
| 01:36 | Redeployed final docs commit and reran live health, responsive gate, and proof mint. |

## Validation Evidence

Completed locally:
- `bun install` — checked 857 installs across 868 packages, no changes.
- `bun run build` — passed, Vite built production assets.
- `bun run check-types` — passed.
- `bun run lint` — passed.
- `curl http://127.0.0.1:3095/health` — HTTP 200.
- `curl http://127.0.0.1:3095/api/health` — HTTP 200.
- `curl http://127.0.0.1:3095/api/metadata/guildsigil.json?...` — HTTP 200, 9 attributes.
- `curl http://127.0.0.1:3095/media/guildsigil.svg?...` — HTTP 200, SVG bytes returned.
- `curl http://127.0.0.1:3095/` — HTTP 200, frontend HTML returned.

Local proof mint:
- **Asset:** `4tH1dxSXrP9uFdyqfGm7yyr6or4vh1E27Zt7tYGyzLa3`
- **Signature:** `3xYhQrjHHeDPdTbX5HMo9uSjWWRwjbg5r6QUmybRH6Nn1mmS3WEqvmZ4oDeEYXrfqrpukMGoJDcyRbiNg3GfNfxx`
- **Owner/update authority:** `ALiC98dw6j47Skrxje3zBN4jTA11w67JRjQRBeZH3BRG`
- **Metadata URI:** `http://127.0.0.1:3095/api/metadata/guildsigil.json?...`
- **Attribute count:** 9
- **Media HTTP:** 200

Pending:
- None.

GitHub/deployment:
- **Repo:** https://github.com/obrera/nightshift-095-guildsigil
- **Live URL:** https://guildsigil095.colmena.dev
- **Project ID:** `qy_mQLde_Avrs0csGuKTU`
- **Compose ID:** `rOji6Fj8altavw5MPEtF2`
- **Domain ID:** `qGI42yzXroxFhxVek_fiL`
- **HEAD:** Captured in final orchestrator report after this documentation commit.

Live validation:
- `curl https://guildsigil095.colmena.dev/health` — HTTP 200, `{"ok":true}`.
- `curl https://guildsigil095.colmena.dev/` — HTTP 200, 1184 bytes.
- `curl https://guildsigil095.colmena.dev/api/metadata/guildsigil.json?...` — HTTP 200, 9 attributes.
- `curl https://guildsigil095.colmena.dev/media/guildsigil.svg?...` — HTTP 200, 2150 bytes.
- `npm --prefix /home/obrera/clawd/nightshift-agents run check:responsive -- --url https://guildsigil095.colmena.dev` — PASS mobile 390, PASS desktop 1280.
- Screenshot sanity check — mobile and desktop no horizontal overflow; mobile shows sigil preview before composer controls.

Live proof mint:
- **Asset:** `D8gMsDEsnp9MuF7cWG1se7StAG2rE7hGTZ7CgV2cUdv4`
- **Signature:** `3SpGJ9oKCmfkm7r6HPPiDv4iAewz4FSTXZECcDMCBuzsS1SyAkZxsJ4fBcePXQx17PY29qgXkV4mPWfSoRRMWQzW`
- **Owner/update authority:** `ALiC98dw6j47Skrxje3zBN4jTA11w67JRjQRBeZH3BRG`
- **Metadata URI:** `https://guildsigil095.colmena.dev/api/metadata/guildsigil.json?shape=warflag&emblem=phoenix&palette=ember&motto=Live%20proof%20room&roles=vanguard,striker,caller,mender&season=Nightfall%20Season%20095&supply=512`
- **Attribute count:** 9
- **Media HTTP:** 200
