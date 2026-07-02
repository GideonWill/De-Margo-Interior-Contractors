export const SYSTEM_PROMPT = `You are Demargo Assistant, the friendly AI helper on the Demargo Interior Contractors website in Ghana. Answer any question the client asks — interior design, renovations, materials, décor ideas, general knowledge, or anything else. Be warm, clear, and helpful.

When questions relate to Demargo, use these facts:
- Services: interior design, home renovation, 3D rendering, curtains and blinds, smart home installation, POP ceilings, painting, tiling, and cleaning
- Contact: 0546478040, demargo1987@gmail.com, WhatsApp wa.me/233546478040
- Address: HM8Q+XJR, Gbawe, Accra
- Hours: Mon–Fri 8AM–5PM, Sat 8AM–4PM
- Service areas: Accra, Kumasi, Tema, Takoradi, Cape Coast, and nearby locations

For Demargo pricing or bookings, explain that cost depends on scope and encourage a free consultation. Do not invent company-specific facts. If unsure about Demargo details, say so and suggest contacting the team directly.`

export const CLAUDE_MODEL = 'claude-3-5-haiku-20241022'

export function parseChatBody(rawBody) {
  if (!rawBody) return {}
  if (typeof rawBody === 'string') {
    try {
      return JSON.parse(rawBody)
    } catch {
      return {}
    }
  }
  if (typeof rawBody === 'object') return rawBody
  return {}
}

export function buildClaudeMessages(message, history) {
  return [
    ...history
      .slice(-8)
      .filter((entry) => String(entry.text || '').trim())
      .map((entry) => ({
        role: entry.role === 'user' ? 'user' : 'assistant',
        content: String(entry.text).trim()
      })),
    { role: 'user', content: message }
  ]
}

function friendlyClaudeFailure(status, message) {
  const text = String(message || '')

  if (/credit balance is too low|purchase credits|plans & billing/i.test(text)) {
    return 'Our AI assistant is temporarily offline while billing is being set up. Please call 0546478040, email demargo1987@gmail.com, or WhatsApp wa.me/233546478040 — our team can help you right away.'
  }

  if (status === 429 || /rate limit|quota/i.test(text)) {
    return 'Our AI assistant is temporarily busy. Please call 0546478040, email demargo1987@gmail.com, or WhatsApp wa.me/233546478040 — our team can help you right away.'
  }

  if (status === 401 || /invalid.*api.*key|authentication|x-api-key/i.test(text)) {
    return 'The assistant is not configured correctly yet. Please call 0546478040 or email demargo1987@gmail.com and our team will assist you.'
  }

  if (status === 404 || /model.*not found|does not exist/i.test(text)) {
    return 'The assistant is being updated. Please call 0546478040 or email demargo1987@gmail.com for immediate help.'
  }

  return null
}

export async function handleChatRequest(body, apiKey) {
  const parsed = parseChatBody(body)
  const message = String(parsed.message || '').trim()
  const history = Array.isArray(parsed.history) ? parsed.history : []

  if (!message) {
    return { status: 400, error: 'Missing message' }
  }

  if (!apiKey) {
    return {
      status: 200,
      reply: 'The assistant is not configured yet. Please add your Anthropic API key in your hosting dashboard (Vercel), then redeploy. You can also call 0546478040 or email demargo1987@gmail.com for help.'
    }
  }

  const messages = buildClaudeMessages(message, history)

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: CLAUDE_MODEL,
      max_tokens: 500,
      system: SYSTEM_PROMPT,
      messages
    })
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    const claudeMessage = data.error?.message || 'Claude request failed'
    const friendly = friendlyClaudeFailure(response.status, claudeMessage)

    console.error('[chat] Claude error:', response.status, claudeMessage)

    if (friendly) {
      return { status: 200, reply: friendly }
    }

    return { status: response.status, error: claudeMessage }
  }

  const reply = data.content?.find((block) => block.type === 'text')?.text?.trim()
    || 'I could not produce a response right now.'

  return { status: 200, reply }
}
