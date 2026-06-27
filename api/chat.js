import process from 'node:process'
import { handleChatRequest, parseChatBody } from '../lib/chat-handler.mjs'

async function readRawBody(req) {
  if (req.body !== undefined && req.body !== null && req.body !== '') {
    return req.body
  }

  const chunks = []
  for await (const chunk of req) {
    chunks.push(chunk)
  }

  const raw = Buffer.concat(chunks).toString('utf8')
  return raw || {}
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const rawBody = await readRawBody(req)
    const body = parseChatBody(rawBody)
    const result = await handleChatRequest(body, process.env.ANTHROPIC_API_KEY)

    if (result.reply) {
      return res.status(result.status || 200).json({ reply: result.reply })
    }

    return res.status(result.status || 500).json({ error: result.error || 'Unexpected server error' })
  } catch (error) {
    console.error('[chat] Server error:', error)
    return res.status(500).json({ error: error.message || 'Unexpected server error' })
  }
}
