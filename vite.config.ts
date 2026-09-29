import { copyFileSync, existsSync, mkdirSync, unlinkSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

const root = dirname(fileURLToPath(import.meta.url))

/**
 * The drummer recruitment landing page lives at /drums (alias /apply).
 * It is a second Vite entry (drums.html) so it gets its own <title> and
 * Open Graph tags for the Meta ad link preview. GitHub Pages is static, so
 * after the build we place a copy at dist/drums/index.html and
 * dist/apply/index.html — both URLs then return a real 200.
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
