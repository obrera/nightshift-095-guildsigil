import { Hono } from 'hono'
import { serveStatic } from 'hono/bun'

import { draftFromSearchParams } from '../src/guildsigil/util/guildsigil-model'
import { createGuildSigilMetadata, renderGuildSigilSvg } from '../src/guildsigil/util/guildsigil-render'

const app = new Hono()
const port = Number(Bun.env.PORT ?? Bun.env.SERVER_PORT ?? 3000)

app.get('/health', (context) =>
  context.json({
    build: '095',
    name: 'GuildSigil',
    ok: true,
    service: 'guildsigil095',
  }),
)

app.get('/api/health', (context) =>
  context.json({
    baseUrl: getBaseUrl(context.req.url, context.req.header('x-forwarded-proto')),
    minting: 'client-wallet-signed',
    network: 'devnet',
    ok: true,
  }),
)

app.get('/api/bootstrap', (context) =>
  context.json({
    build: '095',
    collection: 'uncollectioned-devnet-assets',
    forbiddenServerMint: true,
    liveUrl: 'https://guildsigil095.colmena.dev',
    mplCorePackage: '@obrera/mpl-core-kit-lib',
    rpcUrl: 'https://api.devnet.solana.com',
    walletUi: true,
  }),
)

app.get('/api/metadata/:asset.json', (context) => {
  const draft = draftFromSearchParams(new URL(context.req.url).searchParams)
  return context.json(
    createGuildSigilMetadata(draft, getBaseUrl(context.req.url, context.req.header('x-forwarded-proto'))),
  )
})

app.get('/media/:asset.svg', (context) => {
  const draft = draftFromSearchParams(new URL(context.req.url).searchParams)
  return context.body(renderGuildSigilSvg(draft), 200, {
    'Cache-Control': 'public, max-age=300',
    'Content-Type': 'image/svg+xml; charset=utf-8',
  })
})

app.use('/assets/*', serveStatic({ root: './dist' }))
app.use('/favicon.ico', serveStatic({ path: './dist/favicon.ico' }))
app.use('*', serveStatic({ path: './dist/index.html' }))

console.log(`GuildSigil server listening on ${port}`)

Bun.serve({
  fetch: app.fetch,
  port,
})

function getBaseUrl(requestUrl: string, forwardedProto?: string) {
  const url = new URL(requestUrl)
  return `${forwardedProto ?? url.protocol.replace(':', '')}://${url.host}`
}
