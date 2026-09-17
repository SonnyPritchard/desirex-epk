import { copyFileSync, existsSync, mkdirSync, unlinkSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

const root = dirname(fileURLToPath(import.meta.url))

/**
 * /drums (alias /apply) used to be the drummer recruitment landing page. The
 * band are a full four-piece now, so drums.html is a redirect to the homepage:
 * the URLs stay alive for old Meta ad links and shares instead of 404ing.
 *
 * It stays a second Vite entry because GitHub Pages is static and serves
 * directories from index.html — after the build we place a copy at
 * dist/drums/index.html and dist/apply/index.html so both URLs return a real
 * 200 and redirect, rather than hitting the 404 page.
 */
const LANDING_ENTRY = 'drums.html'
const LANDING_ROUTES = ['drums', 'apply']

type Middleware = (req: { url?: string }, res: unknown, next: () => void) => void

function rewriteLandingRoutes(target: string | ((route: string) => string)): Middleware {
  return (req, _res, next) => {
    const [path, query] = (req.url ?? '').split('?')
    const trimmed = path.replace(/\/+$/, '')
    const route = LANDING_ROUTES.find((r) => trimmed === `/${r}`)
    if (route) {
      const dest = typeof target === 'function' ? target(route) : target
      req.url = `${dest}${query ? `?${query}` : ''}`
    }
    next()
  }
}

function landingPages(): Plugin {
  return {
    name: 'desirex-landing-pages',
    configureServer(server) {
      // Dev server: make /drums and /apply serve drums.html
      server.middlewares.use(rewriteLandingRoutes(`/${LANDING_ENTRY}`))
    },
    configurePreviewServer(server) {
      // `vite preview`: mirror GitHub Pages, where /drums resolves to /drums/index.html
      server.middlewares.use(rewriteLandingRoutes((route) => `/${route}/index.html`))
    },
    closeBundle() {
      const dist = resolve(root, 'dist')
      const built = resolve(dist, LANDING_ENTRY)
      if (!existsSync(built)) return
      for (const route of LANDING_ROUTES) {
        const dir = resolve(dist, route)
        mkdirSync(dir, { recursive: true })
        copyFileSync(built, resolve(dir, 'index.html'))
      }
      unlinkSync(built)
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), landingPages()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(root, 'index.html'),
        drums: resolve(root, LANDING_ENTRY),
      },
    },
  },
})
