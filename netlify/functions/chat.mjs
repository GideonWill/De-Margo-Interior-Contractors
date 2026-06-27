import process from 'node:process'
import { handleChatRequest } from '../../lib/chat-handler.mjs'

export async function handler(event) {
  const jsonHeaders = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: jsonHeaders,
      body: JSON.stringify({ error: 'Method not allowed' })
    }
  }

  try {
    const result = await handleChatRequest(event.body, process.env.ANTHROPIC_API_KEY)

    if (result.reply) {
      return {
        statusCode: result.status || 200,
        headers: jsonHeaders,
        body: JSON.stringify({ reply: result.reply })
      }
    }

    return {
      statusCode: result.status || 500,
      headers: jsonHeaders,
      body: JSON.stringify({ error: result.error || 'Unexpected server error' })
    }
  } catch (error) {
    console.error('[chat] Server error:', error)
    return {
      statusCode: 500,
      headers: jsonHeaders,
      body: JSON.stringify({ error: error.message || 'Unexpected server error' })
    }
  }
}
