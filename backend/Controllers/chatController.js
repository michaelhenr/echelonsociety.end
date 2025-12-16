import dotenv from 'dotenv'
dotenv.config()

const LOVABLE_API_KEY = process.env.LOVABLE_API_KEY
const LOVABLE_API_URL = process.env.LOVABLE_API_URL || 'https://ai.gateway.lovable.dev/v1/chat/completions'

// Simple fallback responses when API is not available
const getFallbackResponse = (message) => {
  const lowerMessage = message.toLowerCase()
  
  if (lowerMessage.includes('product') || lowerMessage.includes('item') || lowerMessage.includes('buy')) {
    return "We offer a variety of unique and special items! You can browse our products on the Products page. Each product is carefully selected for quality and uniqueness."
  }
  if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('egp')) {
    return "Our prices vary by product. You can see the exact price for each item on the Products page. We also offer 10% off for newsletter subscribers!"
  }
  if (lowerMessage.includes('shipping') || lowerMessage.includes('delivery')) {
    return "Shipping costs 70 EGP for Alexandria and Cairo, and 100 EGP for other cities in Egypt. We aim to deliver your order as quickly as possible!"
  }
  if (lowerMessage.includes('brand') || lowerMessage.includes('echelon') || lowerMessage.includes('about')) {
    return "Echelon Society is a brand that offers unique and special items. We're committed to quality and providing exceptional products. Our tagline is 'A Higher Standard'."
  }
  if (lowerMessage.includes('help') || lowerMessage.includes('support')) {
    return "I'm here to help! You can ask me about our products, shipping, prices, or anything else about Echelon Society. How can I assist you today?"
  }
  
  return "Thank you for contacting Echelon Society! I'm here to help with any questions about our products, shipping, or the brand. How can I assist you today?"
}

export async function chatHandler(req, res){
  try{
    const { message } = req.body
    if(!message) return res.status(400).json({ error: 'message is required' })

    // If API key is not configured, use fallback responses
    if(!LOVABLE_API_KEY) {
      console.log('⚠️ LOVABLE_API_KEY not configured, using fallback responses')
      const reply = getFallbackResponse(message)
      return res.json({ reply })
    }

    const systemPrompt = `You are a helpful customer service assistant for Echelon Society, a brand that offers unique and special items.

Key information about Echelon Society:
- Tagline: "A Higher Standard"
- Offers unique and special items across various categories
- Shipping: 70 EGP for Alexandria and Cairo, 100 EGP for other cities
- Newsletter subscribers get 10% off their next order

Answer questions about products, shipping, the brand story, and general inquiries. Be helpful, professional, and embody the brand's values of quality and uniqueness.`

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
    
    if (!response.ok) {
      console.error(`Chat API error: ${response.status} ${response.statusText}`)
      // Fallback to simple responses if API fails
      const reply = getFallbackResponse(message)
      return res.json({ reply })
    }
    
    const data = await response.json()
    const reply = data?.choices?.[0]?.message?.content || getFallbackResponse(message)
    res.json({ reply })
  }catch(err){
    console.error('Chat error:', err)
    // Always return a response, even if there's an error
    const reply = getFallbackResponse(req.body?.message || '')
    res.json({ reply })
  }
}
