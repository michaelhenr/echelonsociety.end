import dotenv from 'dotenv'
dotenv.config()

const LOVABLE_API_KEY = process.env.LOVABLE_API_KEY
const LOVABLE_API_URL = process.env.LOVABLE_API_URL || 'https://ai.gateway.lovable.dev/v1/chat/completions'

export async function chatHandler(req, res){
  if(!LOVABLE_API_KEY) return res.status(500).json({ error: 'LOVABLE_API_KEY not configured' })
  try{
    const { message } = req.body
    if(!message) return res.status(400).json({ error: 'message is required' })

    const systemPrompt = `You are a helpful customer service assistant for Echelon Society, an Egyptian old-money fashion brand founded in 2017.

Key information about Echelon Society:
- Started as sportswear, evolved into fundraising and volunteering for the poor
- Recently rebranded as an old-money fashion brand
- Donates 50% of profits to help the poor and provide clothes for lower-income communities
- Tagline: "A Higher Standard"
- Currently offers:
  - V Crew Sweatshirt: 700 EGP
  - Echelon Quarter Hoodie: 800 EGP
- Shipping: 70 EGP for Alexandria and Cairo, 100 EGP for other cities
- Newsletter subscribers get 10% off their next order

Answer questions about products, shipping, the brand story, and general inquiries. Be helpful, professional, and embody the brand's values of quality and social responsibility.`

    const response = await fetch(LOVABLE_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ]
      })
    })
    const data = await response.json()
    const reply = data?.choices?.[0]?.message?.content || 'Sorry, no reply'
    res.json({ reply })
  }catch(err){
    console.error(err)
    res.status(500).json({ error: 'Internal error' })
  }
}
