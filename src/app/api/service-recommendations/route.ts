import { NextRequest, NextResponse } from 'next/server'
import { SERVICES, Service } from '@/data/services'

interface ServiceRecommendationRequest {
  eventType: string
  guestCount: number
  budget: string
  location?: string
  venue?: string
  preferences?: string
}

interface ServiceRecommendation {
  serviceId: string
  confidence: number
  reasoning: string
  whyPerfect: string
}

async function getAIServiceRecommendations(request: ServiceRecommendationRequest): Promise<ServiceRecommendation[]> {
  // Check if API key is available
  if (!process.env.GROQ_API_KEY) {
    console.log('No GROQ_API_KEY found, AI filtering not available')
    throw new Error('AI filtering not available - GROQ_API_KEY missing')
  }

  try {
    // Dynamically import Groq only when API key is available
    const { default: Groq } = await import('groq-sdk')
    const groq = new Groq()

    const prompt = `For a ${request.eventType} at ${request.venue || 'any venue'}, return ONLY a JSON array with appropriate services from this list:

${SERVICES.map(service => `- ${service.id}: ${service.name} (${service.category}) - $${service.price}`).join('\n')}

FILTERING RULES:
- Birthday Party + Restaurant: Include DJ, photography, catering, decorations, exotic cars, car services, makeup, entertainment. EXCLUDE: kids-birthday-package, sports-knicks-birthday, yacht-party-jboogie, baby-shower-package, wedding services, wellness services
- Sporting Events: Include sports services, DJ, photography, catering. EXCLUDE: baby-shower-package, wedding services, wellness services
- Wedding: Include wedding services, DJ, photography, catering, makeup, decorations. EXCLUDE: kids-birthday-package, sports services, baby-shower-package

CRITICAL: Return ONLY the JSON array, no other text. Start with [ and end with ].

Example format:
[
  {
    "serviceId": "dj-ceo",
    "confidence": 0.9,
    "reasoning": "Perfect for birthday party entertainment",
    "whyPerfect": "Professional DJ with premium sound system"
  }
]`

    const response = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.1,
      max_tokens: 2000
    })

    const aiResponse = response.choices[0].message.content || '{}'
    console.log('AI Response:', aiResponse)
    
    try {
      const result = JSON.parse(aiResponse)
      return result.recommendations || result || []
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError)
      console.error('Raw AI Response:', aiResponse)
      throw new Error('AI returned invalid JSON: ' + aiResponse.substring(0, 100))
    }
  } catch (error) {
    console.error('AI service recommendation error:', error)
    throw new Error('AI filtering failed: ' + (error instanceof Error ? error.message : String(error)))
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { eventType, guestCount, budget, location, venue, preferences } = body

    if (!eventType || !guestCount || !budget) {
      return NextResponse.json(
        { error: 'Missing required fields: eventType, guestCount, budget' },
        { status: 400 }
      )
    }

    console.log('Processing service recommendation request:', { eventType, guestCount, budget, location, venue, preferences })

    const recommendations = await getAIServiceRecommendations({
      eventType,
      guestCount,
      budget,
      location,
      venue,
      preferences
    })

    console.log('Generated service recommendations:', recommendations.length)

    return NextResponse.json({ recommendations })
  } catch (error) {
    console.error('Service recommendation API route error:', error)
    return NextResponse.json(
      { error: 'AI filtering failed: ' + (error instanceof Error ? error.message : String(error)) },
      { status: 500 }
    )
  }
}