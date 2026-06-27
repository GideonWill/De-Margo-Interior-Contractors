import process from 'node:process'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const body = req.body || {}
    const message = String(body.message || '').trim()
    const history = Array.isArray(body.history) ? body.history : []
    const apiKey = process.env.OPENAI_API_KEY

    if (!message) {
      return res.status(400).json({ error: 'Missing message' })
    }

    if (!apiKey) {
      return res.status(200).json({
        reply: 'The assistant is not configured yet. Please add your OpenAI API key in Vercel project settings.'
      })
    }

    const messages = [
      {
        role: 'system',
        content: `You are Demargo Assistant, the AI helper for Demargo Interior Contractors in Ghana. Answer questions warmly, clearly, and concisely. Use the following business details when relevant: Demargo offers interior design, home renovation, 3D rendering, curtains and blinds, smart home installation, POP ceilings, painting, tiling, and cleaning. Contact: 0546478040, demargo1987@gmail.com, WhatsApp wa.me/233546478040. Address: HM8Q+XJR, Gbawe, Accra. Hours: Mon-Fri 8AM-5PM, Sat 8AM-4PM. If the user asks about pricing or booking, encourage a consultation and mention that pricing depends on scope. Avoid making up facts. If you are unsure, say so and suggest contacting the company directly.`
      },
      ...history.slice(-8).map((entry) => ({
        role: entry.role === 'user' ? 'user' : 'assistant',
        content: String(entry.text || '')
      })),
      { role: 'user', content: message }
    ]

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages,
        temperature: 0.7,
        max_tokens: 250
      })
    })

    const data = await response.json()

    if (!response.ok) {
      return res.status(response.status).json({ error: data.error?.message || 'OpenAI request failed' })
    }

    const reply = data.choices?.[0]?.message?.content?.trim() || 'I could not produce a response right now.'
    return res.status(200).json({ reply })
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Unexpected server error' })
  }
}
