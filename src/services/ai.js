/**
 * Creator Forge — AI Generation Service
 *
 * Text:  Google Gemini 2.0 Flash  via /api/gemini proxy   (Gemini key: AIzaSy...)
 * Image: Together.ai FLUX Free    via /api/together proxy  (Together key: free at together.ai)
 *
 * Keys stored in localStorage — never sent to Forge servers.
 */

// ── Key management ─────────────────────────────────────────────────────────────

export function loadAiKeys() {
  return {
    geminiKey:    localStorage.getItem('forge_gemini_key')    || '',
    togetherKey:  localStorage.getItem('forge_together_key')  || '',
  }
}

export function saveAiKeys({ geminiKey, togetherKey }) {
  if (geminiKey   !== undefined) localStorage.setItem('forge_gemini_key',   geminiKey.trim())
  if (togetherKey !== undefined) localStorage.setItem('forge_together_key', togetherKey.trim())
}

export function hasGeminiKey() {
  return !!localStorage.getItem('forge_gemini_key')
}

export function hasTogetherKey() {
  return !!localStorage.getItem('forge_together_key')
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function fmt(n) {
  n = parseInt(n) || 0
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000)     return `${Math.round(n / 1_000)}K`
  return String(n)
}

// ── Gemini call ────────────────────────────────────────────────────────────────

async function geminiCall(prompt, systemPrompt, maxTokens = 3000) {
  const { geminiKey } = loadAiKeys()
  if (!geminiKey) throw new Error('NO_GEMINI_KEY')

  const url = `/api/gemini/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiKey}`

  const body = {
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    systemInstruction: { parts: [{ text: systemPrompt }] },
    generationConfig: {
      responseMimeType: 'application/json',
      maxOutputTokens: maxTokens,
      temperature: 0.85,
    },
  }

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Gemini ${res.status}: ${err.slice(0, 300)}`)
  }

  const data = await res.json()
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || ''
  if (!text) throw new Error('Gemini returned empty response')

  // Gemini with responseMimeType=json should return clean JSON, but strip fences just in case
  const cleaned = text.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim()
  return JSON.parse(cleaned)
}

// ── Generate full marketing pack ───────────────────────────────────────────────

export async function generateMarketingPack(creatorData) {
  const name        = creatorData.name        || creatorData.handle?.replace('@','') || 'this creator'
  const handle      = creatorData.handle      || '@creator'
  const platform    = creatorData.platform    || 'social media'
  const followers   = creatorData.followers   ? fmt(creatorData.followers) : 'growing'
  const engRate     = creatorData.engagementRate ? `${creatorData.engagementRate}%` : 'solid'
  const niche       = creatorData.niche       || 'content creation'
  const productName = creatorData.productName || 'Creator Academy'
  const blueprint   = creatorData.blueprint
  const productDesc = blueprint?.description  || `a premium ${niche} platform`
  const bio         = creatorData.description ? `\nBio: "${creatorData.description.slice(0, 150)}"` : ''

  const system = `You are an elite creator economy marketing strategist. Write copy that sounds exactly like this creator — authentic, platform-native, never generic. Return ONLY valid JSON.`

  const prompt = `Generate a complete product launch marketing pack for:

Creator: ${name} (${handle})
Platform: ${platform} — ${followers} followers, ${engRate} engagement
Niche: ${niche}${bio}
Launching: "${productName}" — ${productDesc}

Return this exact JSON (be specific, personal, creator-native — not generic):

{
  "email": {
    "subject": "subject line under 60 chars — curiosity-driven",
    "preview": "preview text under 80 chars",
    "body": "full launch email 220-280 words — first person, conversational, ends with CTA and [PRODUCT_LINK]"
  },
  "instagram": {
    "caption": "150-200 char caption — hook first, story, CTA. Use line breaks.",
    "hashtags": ["6 relevant hashtags without #"]
  },
  "twitter": {
    "thread": ["tweet 1 hook <240 chars", "tweet 2 value <240 chars", "tweet 3 social proof <240 chars", "tweet 4 CTA with [PRODUCT_LINK] <240 chars"]
  },
  "tiktok": {
    "hook": "opening line — first 3 seconds, under 9 words",
    "script": "30-second TikTok script with [ACTION] cues"
  },
  "pitchDeck": {
    "headline": "product headline under 8 words",
    "tagline": "supporting tagline under 18 words",
    "slides": [
      { "title": "Problem", "bullets": ["3 specific pain points"] },
      { "title": "Solution", "bullets": ["3 ways ${productName} solves them"] },
      { "title": "What's Inside", "bullets": ["4 key features"] },
      { "title": "Who It's For", "bullets": ["3 audience descriptions"] },
      { "title": "The Offer", "bullets": ["founding price", "what they get", "urgency"] }
    ]
  }
}`

  return geminiCall(prompt, system, 3200)
}

// ── Regenerate one section ─────────────────────────────────────────────────────

export async function regenerateSection(section, creatorData) {
  const name        = creatorData.name        || creatorData.handle?.replace('@','') || 'this creator'
  const productName = creatorData.productName || 'Creator Academy'
  const niche       = creatorData.niche       || 'content creation'

  const prompts = {
    email:     `Write a completely different launch email for "${productName}" by ${name}. New angle, same authenticity. Return JSON: { "subject": "...", "preview": "...", "body": "..." }`,
    instagram: `Write a fresh Instagram launch caption for "${productName}" by ${name}. Different hook. Return JSON: { "caption": "...", "hashtags": ["..."] }`,
    twitter:   `Write a new 4-tweet launch thread for "${productName}" by ${name}. Fresh angle. Return JSON: { "thread": ["t1","t2","t3","t4"] }`,
    tiktok:    `Write a new 30-second TikTok script for "${productName}" by ${name}. New hook. Return JSON: { "hook": "...", "script": "..." }`,
    pitchDeck: `Create a fresh pitch deck for "${productName}" by ${name} in ${niche}. New framing. Return JSON: { "headline": "...", "tagline": "...", "slides": [{ "title": "...", "bullets": ["..."] }] }`,
  }

  return geminiCall(prompts[section], 'You are a creator economy marketing expert. Return ONLY valid JSON.', 1200)
}

// ── Gemini image generation (uses existing Gemini key — no extra signup) ───────
// Model: gemini-2.0-flash-exp-image-generation
// Same key as text generation — free at aistudio.google.com/apikey

export async function generateProductImageWithGemini(creatorData) {
  const { geminiKey } = loadAiKeys()
  if (!geminiKey) throw new Error('NO_GEMINI_KEY')

  const productName = creatorData.productName || 'Creator Academy'
  const niche       = creatorData.niche       || 'content creation'
  const type        = creatorData.blueprint?.type || 'Web App'

  const prompt = `Sleek dark ${type} app screenshot mockup for a ${niche} creator platform called "${productName}". Premium SaaS UI on deep dark background with subtle glow. Shows a clean dashboard with course cards and metrics. No real text, just UI shapes and blocks. Professional product photography style. Linear, Notion aesthetic. Ultra detailed.`

  const url = `/api/gemini/v1beta/models/gemini-2.0-flash-exp-image-generation:generateContent?key=${geminiKey}`

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: { responseModalities: ['IMAGE', 'TEXT'] },
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Gemini image ${res.status}: ${err.slice(0, 300)}`)
  }

  const data = await res.json()
  // Image comes back as inlineData base64
  const parts = data?.candidates?.[0]?.content?.parts || []
  const imgPart = parts.find(p => p.inlineData)
  if (!imgPart) throw new Error('Gemini returned no image')
  const { mimeType, data: b64 } = imgPart.inlineData
  return `data:${mimeType};base64,${b64}`
}

// ── Together.ai FLUX image generation ─────────────────────────────────────────
// Free model: black-forest-labs/FLUX.1-schnell-Free (no credits needed)
// Get key free at: together.ai

export async function generateProductImageWithTogether(creatorData) {
  const { togetherKey } = loadAiKeys()
  if (!togetherKey) throw new Error('NO_TOGETHER_KEY')

  const productName = creatorData.productName || 'Creator Academy'
  const niche       = creatorData.niche       || 'content creation'
  const type        = creatorData.blueprint?.type || 'Web App'

  const prompt = `Sleek dark ${type} screenshot mockup for "${productName}" — ${niche} creator platform. Premium SaaS UI, floating on deep dark background with subtle glow. Shows dashboard or course page with cards and metrics. No text. Professional product photography. Ultra detailed. Linear, Notion aesthetic.`

  const res = await fetch('/api/together/v1/images/generations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${togetherKey}`,
    },
    body: JSON.stringify({
      model: 'black-forest-labs/FLUX.1-schnell-Free',
      prompt,
      width: 1024,
      height: 576,
      steps: 4,
      n: 1,
      response_format: 'url',
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Together.ai ${res.status}: ${err.slice(0, 300)}`)
  }

  const data = await res.json()
  if (data?.data?.[0]?.url) return data.data[0].url
  if (data?.data?.[0]?.b64_json) return `data:image/png;base64,${data.data[0].b64_json}`
  return null
}

// ── generateProductImage — tries Gemini first, Together.ai as fallback ─────────

export async function generateProductImage(creatorData) {
  // Try Gemini (same key user already has)
  if (hasGeminiKey()) {
    try {
      return await generateProductImageWithGemini(creatorData)
    } catch (e) {
      // Gemini image generation may not be available on all accounts — fall through
      console.warn('Gemini image failed, trying Together.ai:', e.message)
    }
  }
  // Fallback: Together.ai FLUX
  return generateProductImageWithTogether(creatorData)
}
