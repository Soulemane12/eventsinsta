import { NextRequest, NextResponse } from 'next/server'
import { SERVICES, Service } from '@/data/services'

interface ServiceRecommendationRequest {
  eventType: string
  guestCount: number
  budget: string
  location?: string
  preferences?: string
}

interface ServiceRecommendation {
  serviceId: string
  confidence: number
  reasoning: string
  whyPerfect: string
}

// Fallback service recommendation logic when AI is not available
function getFallbackServiceRecommendations(request: ServiceRecommendationRequest): ServiceRecommendation[] {
  const { eventType, guestCount, budget } = request
  
  const recommendations: ServiceRecommendation[] = []
  
  // Parse budget range
  const budgetRange = budget.split(' - ')
  const minBudget = parseInt(budgetRange[0]?.replace(/[^0-9]/g, '') || '0')
  const maxBudget = parseInt(budgetRange[1]?.replace(/[^0-9]/g, '') || '0')
  
  // Birthday events
  if (eventType.toLowerCase().includes('birthday')) {
    if (guestCount <= 12) {
      // Kids birthday
      recommendations.push({
        serviceId: 'kids-birthday-package',
        confidence: 0.95,
        reasoning: 'Complete birthday package for kids ages 2-12',
        whyPerfect: 'All-inclusive package with decorations, activities, and entertainment for up to 35 kids.'
      })
    } else {
      // Adult birthday
      recommendations.push({
        serviceId: 'dj-ceo',
        confidence: 0.90,
        reasoning: 'Professional DJ for birthday celebration',
        whyPerfect: 'Premium sound system and lighting for a memorable birthday party.'
      })
      recommendations.push({
        serviceId: 'photographer-premium',
        confidence: 0.85,
        reasoning: 'Professional photography to capture birthday memories',
        whyPerfect: '4 hours of photography and videography to document the special day.'
      })
    }
  }
  
  // Anniversary events
  if (eventType.toLowerCase().includes('anniversary')) {
    recommendations.push({
      serviceId: 'photographer-premium',
      confidence: 0.95,
      reasoning: 'Professional photography for romantic anniversary',
      whyPerfect: 'Capture precious moments with 4 hours of photography and videography.'
    })
    if (maxBudget >= 2000) {
      recommendations.push({
        serviceId: 'exotic-car-rolls-royce-ghost',
        confidence: 0.80,
        reasoning: 'Luxury transportation for special anniversary',
        whyPerfect: 'Ultra-luxury Rolls Royce for an unforgettable anniversary experience.'
      })
    }
  }
  
  // Holiday party events
  if (eventType.toLowerCase().includes('holiday')) {
    recommendations.push({
      serviceId: 'dj-ceo',
      confidence: 0.90,
      reasoning: 'Professional DJ for holiday celebration',
      whyPerfect: 'Premium sound system and lighting for festive holiday atmosphere.'
    })
    recommendations.push({
      serviceId: 'decorations-premium',
      confidence: 0.85,
      reasoning: 'Holiday decorations and setup',
      whyPerfect: 'Full event decoration to create a festive holiday atmosphere.'
    })
  }
  
  // Wedding events
  if (eventType.toLowerCase().includes('wedding')) {
    recommendations.push({
      serviceId: 'wedding-metropolitan',
      confidence: 0.98,
      reasoning: 'Wedding venue package for 250 guests',
      whyPerfect: 'Complete wedding package including venue, food, and liquor for 5 hours.'
    })
    recommendations.push({
      serviceId: 'photographer-premium',
      confidence: 0.95,
      reasoning: 'Professional wedding photography',
      whyPerfect: 'Essential for capturing wedding memories with 4 hours of coverage.'
    })
    recommendations.push({
      serviceId: 'makeup-premium',
      confidence: 0.90,
      reasoning: 'Professional makeup for wedding party',
      whyPerfect: 'Premium makeup and hair styling for the special day.'
    })
  }
  
  // Corporate events
  if (eventType.toLowerCase().includes('corporate')) {
    recommendations.push({
      serviceId: 'catering-premium',
      confidence: 0.90,
      reasoning: 'Professional catering for corporate event',
      whyPerfect: 'Full-service catering with wait staff for professional presentation.'
    })
    if (maxBudget >= 5000) {
      recommendations.push({
        serviceId: 'venue-hamptons-pool',
        confidence: 0.80,
        reasoning: 'Premium venue for corporate retreat',
        whyPerfect: 'Luxury Hamptons venue with pool for upscale corporate events.'
      })
    }
  }
  
  // Sports events
  if (eventType.toLowerCase().includes('sports') || eventType.toLowerCase().includes('knicks')) {
    recommendations.push({
      serviceId: 'sports-knicks-birthday',
      confidence: 0.95,
      reasoning: 'NY Knicks game experience',
      whyPerfect: 'Lower-level tickets with drinks and birthday shoutout on Jumbotron.'
    })
  }
  
  // Vacation events
  if (eventType.toLowerCase().includes('vacation') || eventType.toLowerCase().includes('travel')) {
    recommendations.push({
      serviceId: 'vacation-aruba-swiss-paradise',
      confidence: 0.95,
      reasoning: '5-night vacation package to Aruba',
      whyPerfect: 'All-inclusive resort experience with flight from JFK.'
    })
  }
  
  // Filter by budget
  const budgetFilteredRecommendations = recommendations.filter(rec => {
    const service = SERVICES.find(s => s.id === rec.serviceId)
    return service && service.price <= maxBudget
  })
  
  return budgetFilteredRecommendations.slice(0, 5) // Limit to top 5 recommendations
}

async function getAIServiceRecommendations(request: ServiceRecommendationRequest): Promise<ServiceRecommendation[]> {
  // Check if API key is available
  if (!process.env.GROQ_API_KEY) {
    console.log('No GROQ_API_KEY found, using fallback service recommendations')
    return getFallbackServiceRecommendations(request)
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

Based on the user's request, recommend ONLY the services that are the best fit. Consider:
- Event type compatibility
- Guest count appropriateness
- Budget range match
- Service relevance to the event type

IMPORTANT: Only recommend services that make sense for the specific event type and budget. If no services are suitable, return an empty array.

User Request:
- Event Type: ${request.eventType}
- Guest Count: ${request.guestCount}
- Budget: ${request.budget}
- Location: ${request.location || 'New York City'}
- Additional Preferences: ${request.preferences || 'None specified'}

Respond with a JSON array of recommendations, each containing:
- serviceId: the exact service ID from the list above
- confidence: 0-1 score indicating how well it matches
- reasoning: brief explanation of why this service is recommended
- whyPerfect: what makes this service perfect for this event

If no services match the user's requirements, return an empty array. Be honest about limitations.
`

    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: 'You are an expert event planning AI that provides service recommendations. Always respond with valid JSON only. It is perfectly acceptable to return an empty array if no services match the requirements.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3,
      max_tokens: 1000
    })

    const result = JSON.parse(response.choices[0].message.content || '{}')
    return result.recommendations || []
  } catch (error) {
    console.error('AI service recommendation error:', error)
    console.log('Falling back to rule-based service recommendations')
    return getFallbackServiceRecommendations(request)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { eventType, guestCount, budget, location, preferences } = body

    if (!eventType || !guestCount || !budget) {
      return NextResponse.json(
        { error: 'Missing required fields: eventType, guestCount, budget' },
        { status: 400 }
      )
    }

    console.log('Processing service recommendation request:', { eventType, guestCount, budget, location, preferences })
    console.log('GROQ_API_KEY available:', !!process.env.GROQ_API_KEY)

    const recommendations = await getAIServiceRecommendations({
      eventType,
      guestCount,
      budget,
      location,
      preferences
    })

    console.log('Generated service recommendations:', recommendations.length)

    return NextResponse.json({ recommendations })
  } catch (error) {
    console.error('Service recommendation API route error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
