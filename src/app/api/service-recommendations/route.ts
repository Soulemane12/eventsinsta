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

// Fallback service recommendation logic when AI is not available
function getFallbackServiceRecommendations(request: ServiceRecommendationRequest): ServiceRecommendation[] {
  const { eventType, guestCount, budget, venue } = request
  
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
  
  // Filter by event type and venue compatibility - be intelligent about what makes sense
  const smartFilteredRecommendations = budgetFilteredRecommendations.filter(rec => {
    const service = SERVICES.find(s => s.id === rec.serviceId)
    if (!service) return false
    
    // Always exclude venue services when a venue is already selected
    if (service.category === 'Venue') {
      return false
    }
    
    const eventTypeLower = eventType.toLowerCase()
    const venueLower = venue?.toLowerCase() || ''
    const serviceNameLower = service.name.toLowerCase()
    const serviceCategoryLower = service.category.toLowerCase()
    
    // Event type specific filtering
    if (eventTypeLower.includes('birthday')) {
      // For birthdays, exclude services that don't make sense for birthday parties
      if (serviceNameLower.includes('baby shower') || 
          serviceNameLower.includes('wedding') ||
          serviceNameLower.includes('kids birthday') ||
          serviceNameLower.includes('wellness') ||
          serviceNameLower.includes('spa') ||
          serviceNameLower.includes('biohack') ||
          serviceNameLower.includes('coaching') ||
          serviceNameLower.includes('boxing') ||
          serviceNameLower.includes('aruba') ||
          serviceNameLower.includes('vacation') ||
          serviceNameLower.includes('knicks') ||
          serviceNameLower.includes('golf') ||
          serviceNameLower.includes('sporting') ||
          serviceCategoryLower.includes('wedding') ||
          serviceCategoryLower.includes('kids') ||
          serviceCategoryLower.includes('health') ||
          serviceCategoryLower.includes('vacation') ||
          serviceCategoryLower.includes('sporting')) {
        return false
      }
    }
    
    if (eventTypeLower.includes('wedding')) {
      // For weddings, exclude services that don't make sense for weddings
      if (serviceNameLower.includes('kids birthday') || 
          serviceNameLower.includes('baby shower') ||
          serviceNameLower.includes('kids') ||
          serviceNameLower.includes('boxing') ||
          serviceNameLower.includes('aruba') ||
          serviceNameLower.includes('vacation') ||
          serviceNameLower.includes('wellness') ||
          serviceNameLower.includes('spa') ||
          serviceNameLower.includes('biohack') ||
          serviceNameLower.includes('coaching') ||
          serviceCategoryLower.includes('kids') ||
          serviceCategoryLower.includes('vacation') ||
          serviceCategoryLower.includes('health')) {
        return false
      }
    }
    
    if (eventTypeLower.includes('baby shower')) {
      // For baby showers, exclude services that don't make sense for baby showers
      if (serviceNameLower.includes('wedding') || 
          serviceNameLower.includes('kids birthday') ||
          serviceNameLower.includes('boxing') ||
          serviceNameLower.includes('aruba') ||
          serviceNameLower.includes('vacation') ||
          serviceNameLower.includes('wellness') ||
          serviceNameLower.includes('spa') ||
          serviceNameLower.includes('biohack') ||
          serviceNameLower.includes('coaching') ||
          serviceCategoryLower.includes('wedding') ||
          serviceCategoryLower.includes('kids') ||
          serviceCategoryLower.includes('vacation') ||
          serviceCategoryLower.includes('health')) {
        return false
      }
    }
    
    if (eventTypeLower.includes('corporate')) {
      // For corporate events, exclude personal services
      if (serviceNameLower.includes('baby shower') || 
          serviceNameLower.includes('kids birthday') ||
          serviceNameLower.includes('wedding') ||
          serviceNameLower.includes('kids') ||
          serviceNameLower.includes('aruba') ||
          serviceNameLower.includes('vacation') ||
          serviceNameLower.includes('wellness') ||
          serviceNameLower.includes('spa') ||
          serviceNameLower.includes('biohack') ||
          serviceNameLower.includes('coaching') ||
          serviceCategoryLower.includes('kids') ||
          serviceCategoryLower.includes('wedding') ||
          serviceCategoryLower.includes('vacation') ||
          serviceCategoryLower.includes('health')) {
        return false
      }
    }
    
    // Venue specific filtering
    if (venueLower.includes('boat')) {
      // For boat venues, exclude large items and venue services
      if (serviceNameLower.includes('exotic car') || 
          serviceNameLower.includes('bmw') ||
          serviceNameLower.includes('rolls royce') ||
          serviceNameLower.includes('mercedes') ||
          serviceNameLower.includes('range rover')) {
        return false
      }
    }
    
    if (venueLower.includes('sports-arena')) {
      // For sports arenas, focus on entertainment and corporate services
      if (serviceNameLower.includes('wellness') || 
          serviceNameLower.includes('spa') ||
          serviceNameLower.includes('biohack') ||
          serviceNameLower.includes('coaching')) {
        return false
      }
    }
    
    if (venueLower.includes('health-wellness')) {
      // For health & wellness venues, focus on wellness services
      if (serviceNameLower.includes('exotic car') || 
          serviceNameLower.includes('bmw') ||
          serviceNameLower.includes('rolls royce') ||
          serviceNameLower.includes('mercedes') ||
          serviceNameLower.includes('range rover') ||
          serviceNameLower.includes('sports') ||
          serviceNameLower.includes('knicks')) {
        return false
      }
    }
    
    if (venueLower.includes('restaurant')) {
      // For restaurant venues, exclude services that don't make sense in restaurants
      if (serviceNameLower.includes('exotic car') || 
          serviceNameLower.includes('bmw') ||
          serviceNameLower.includes('rolls royce') ||
          serviceNameLower.includes('mercedes') ||
          serviceNameLower.includes('range rover') ||
          serviceNameLower.includes('yacht') ||
          serviceNameLower.includes('boat')) {
        return false
      }
    }
    
    return true // Include all other services
  })
  
  return smartFilteredRecommendations
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

Based on the user's request, identify services that make logical sense for this specific event type and venue combination. Consider:
- Event type compatibility (e.g., don't show baby shower services for birthday parties)
- Venue type compatibility (e.g., don't show exotic cars for boat venues)
- Service relevance to the event type and venue combination

IMPORTANT: Only show services that logically make sense for this specific event type and venue. For example:
- Birthday + Restaurant: Show entertainment, catering, photography, but NOT baby shower services
- Wedding + Private Home: Show wedding services, entertainment, catering, but NOT kids birthday services
- Corporate + Sports Arena: Show corporate services, team building, but NOT personal wellness services

Be selective and only include services that are actually relevant to the specific event type and venue combination.

User Request:
- Event Type: ${request.eventType}
- Venue: ${request.venue || 'Not specified'}
- Guest Count: ${request.guestCount}
- Budget: ${request.budget}
- Location: ${request.location || 'New York City'}
- Additional Preferences: ${request.preferences || 'None specified'}

Respond with a JSON array of relevant services, each containing:
- serviceId: the exact service ID from the list above
- confidence: 0-1 score indicating relevance (0.7+ means highly relevant)
- reasoning: brief explanation of why this service makes sense for this specific event type and venue
- whyPerfect: what makes this service appropriate for this event

Only include services that are actually relevant to the specific event type and venue combination. Be selective and logical in your choices.
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
    const { eventType, guestCount, budget, location, venue, preferences } = body

    if (!eventType || !guestCount || !budget) {
      return NextResponse.json(
        { error: 'Missing required fields: eventType, guestCount, budget' },
        { status: 400 }
      )
    }

    console.log('Processing service recommendation request:', { eventType, guestCount, budget, location, venue, preferences })
    console.log('GROQ_API_KEY available:', !!process.env.GROQ_API_KEY)

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
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
