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

    const prompt = `
You are an expert event planning AI assistant. You need to recommend services from the following list based on the user's event requirements.

Available Services:
${SERVICES.map(service => `
- ${service.name} (${service.category}): ${service.priceDescription}
  Description: ${service.description}
  Price: $${service.price}
`).join('\n')}

You are an expert event planning AI. Analyze the event context and ONLY recommend services that make perfect logical sense for this specific event type and venue combination.

EVENT CONTEXT ANALYSIS:
- Event Type: ${request.eventType}
- Venue: ${request.venue || 'Not specified'}
- Guest Count: ${request.guestCount}
- Budget: ${request.budget}
- Location: ${request.location || 'New York City'}

FILTERING RULES - BE VERY SELECTIVE:

1. EVENT TYPE FILTERING:
   - Birthday Parties: Include entertainment, catering, photography, decorations, exotic cars. EXCLUDE: baby shower, wedding, kids birthday, wellness, spa, coaching, boxing, vacation, sporting events
   - Wedding Events: Include wedding services, entertainment, photography, catering. EXCLUDE: kids birthday, baby shower, boxing, vacation, wellness, sporting events
   - Sporting Events: Include sports activities (NY Knicks, golf, boxing), entertainment, photography. EXCLUDE: baby shower, wedding, kids birthday, wellness, spa, vacation
   - Corporate Events: Include professional services, team building, entertainment. EXCLUDE: baby shower, kids birthday, wedding, vacation, wellness, sporting events
   - Baby Shower: Include baby shower services, gentle entertainment, photography. EXCLUDE: wedding, kids birthday, boxing, vacation, wellness, sporting events

2. VENUE FILTERING:
   - Restaurant: Include most services. EXCLUDE: yacht, boat services
   - Sports Arena: Include sports, entertainment, catering, photography. EXCLUDE: wellness, spa, yacht, boat, makeup, barber
   - Private Home: Include most services. EXCLUDE: venue services (since venue already selected)
   - Boat/Yacht: Include entertainment, photography, catering. EXCLUDE: exotic cars, venue services
   - Health & Wellness: Include wellness services, photography. EXCLUDE: exotic cars, sports, yacht, boat

3. STRICT EXCLUSIONS:
   - Always exclude venue services when a venue is already selected
   - Never show baby shower services for birthday parties
   - Never show wedding services for non-wedding events
   - Never show yacht services for non-water venues
   - Never show exotic cars for boat venues
   - Never show wellness services for sporting events

BE VERY SELECTIVE: Only include services that are 100% appropriate for this specific event type AND venue combination.

User Request:
- Event Type: ${request.eventType}
- Venue: ${request.venue || 'Not specified'}
- Guest Count: ${request.guestCount}
- Budget: ${request.budget}
- Location: ${request.location || 'New York City'}
- Additional Preferences: ${request.preferences || 'None specified'}

RESPOND WITH A JSON ARRAY of services that are 100% appropriate for this event. Each service should include:
- serviceId: the exact service ID from the list above
- confidence: 0.9-1.0 score (only include services you're 90%+ confident about)
- reasoning: specific explanation of why this service is perfect for this event type + venue combination
- whyPerfect: what makes this service ideal for this specific event context

CRITICAL: Be extremely selective. If you have any doubt about a service's appropriateness, DO NOT include it. Better to show fewer, perfectly relevant services than to include anything questionable.

EXAMPLES OF PERFECT MATCHES:
- Birthday + Restaurant: DJ services, photography, catering, decorations, exotic cars
- Sporting Events + Sports Arena: NY Knicks packages, golf lessons, boxing lessons, photography, catering
- Wedding + Private Home: wedding services, formal entertainment, photography, catering

EXAMPLES OF BAD MATCHES (NEVER INCLUDE):
- Baby shower services for birthday parties
- Yacht services for sports arenas
- Wedding services for sporting events
- Wellness services for birthday parties
`

    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.1,
      max_tokens: 1000
    })

    const result = JSON.parse(response.choices[0].message.content || '{}')
    return result.recommendations || []
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