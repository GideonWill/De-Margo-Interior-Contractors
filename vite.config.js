import { defineConfig, loadEnv } from 'vite'
import { handler as chatHandler } from './netlify/functions/chat.mjs'

function readRequestBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = []
    req.on('data', (chunk) => chunks.push(chunk))
    req.on('end', () => resolve(Buffer.concat(chunks).toString()))
    req.on('error', reject)
  })
}

function chatApiDevPlugin(env) {
  Object.assign(process.env, env)

  return {
    name: 'chat-api-dev',
    configureServer(server) {
      server.middlewares.use('/api/chat', async (req, res, next) => {
        if (req.method !== 'POST') {
          res.statusCode = 405
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: 'Method not allowed' }))
          return
        }

        try {
          const body = await readRequestBody(req)
          const result = await chatHandler({
            httpMethod: 'POST',
            body,
            headers: req.headers
          })

          res.statusCode = result.statusCode
          for (const [key, value] of Object.entries(result.headers || {})) {
            res.setHeader(key, value)
          }
          res.end(result.body)
        } catch (error) {
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: error.message || 'Unexpected server error' }))
        }
      })
    }
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [chatApiDevPlugin(env)]
  }
})
