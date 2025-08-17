import { NextRequest, NextResponse } from 'next/server'

interface RecommendationRequest {
  eventType: string
  guestCount: number
  budget: string
  location?: string
  preferences?: string
}

interface AIRecommendation {
  restaurantId: string
  confidence: number
  reasoning: string
  bestPackage: string
  whyPerfect: string
}

// Fallback recommendation logic when AI is not available
function getFallbackRecommendations(request: RecommendationRequest): AIRecommendation[] {
  const { eventType, guestCount, budget } = request
  
  const recommendations: AIRecommendation[] = []
  
  // Saint Restaurant - good for most events
  if (guestCount >= 2 && guestCount <= 100) {
    if (eventType.toLowerCase().includes('anniversary') || eventType.toLowerCase().includes('romantic')) {
      recommendations.push({
        restaurantId: 'saint-restaurant',
        confidence: 0.95,
        reasoning: 'Perfect for romantic occasions with intimate dining and speakeasy atmosphere',
        bestPackage: 'Anniversary Dinner for Two',
        whyPerfect: 'Saint Restaurant offers an elegant, intimate setting perfect for anniversary celebrations with their speakeasy bar and romantic ambiance.'
      })
    } else if (eventType.toLowerCase().includes('holiday') && guestCount >= 20) {
      recommendations.push({
        restaurantId: 'saint-restaurant',
        confidence: 0.98,
        reasoning: 'Large capacity with open bar package perfect for holiday celebrations',
        bestPackage: 'Holiday Party Package',
        whyPerfect: 'Saint Restaurant can accommodate large groups with their holiday party package including 2-hour open bar.'
      })
    } else if (eventType.toLowerCase().includes('birthday')) {
      recommendations.push({
        restaurantId: 'saint-restaurant',
        confidence: 0.90,
        reasoning: 'Great atmosphere for birthday celebrations with group dining options',
        bestPackage: 'Birthday Celebration',
        whyPerfect: 'Saint Restaurant provides a festive atmosphere perfect for birthday celebrations with their signature share plates.'
      })
    }
  }
  
  // Rebel Restaurant - great for cultural and group events
  if (guestCount >= 2 && guestCount <= 50) {
    if (eventType.toLowerCase().includes('birthday') || eventType.toLowerCase().includes('group')) {
      recommendations.push({
        restaurantId: 'rebel-restaurant',
        confidence: 0.92,
        reasoning: 'Authentic Haitian atmosphere perfect for group celebrations',
        bestPackage: 'Group Party Package',
        whyPerfect: 'Rebel Restaurant offers a unique cultural experience with great group dining options and vibrant atmosphere.'
      })
    } else if (eventType.toLowerCase().includes('cultural')) {
      recommendations.push({
        restaurantId: 'rebel-restaurant',
        confidence: 0.95,
        reasoning: 'Authentic Haitian cuisine and cultural experience',
        bestPackage: 'Three-Course Dinner for Two',
        whyPerfect: 'Rebel Restaurant showcases authentic Haitian food, art, and culture for a unique dining experience.'
      })
    }
  }
  
  // Del Frisco's - luxury and corporate events
  if (guestCount >= 2 && guestCount <= 200) {
    if (eventType.toLowerCase().includes('corporate') || eventType.toLowerCase().includes('business')) {
      recommendations.push({
        restaurantId: 'del-friscos',
        confidence: 0.96,
        reasoning: 'Premium steakhouse perfect for corporate events and business dining',
        bestPackage: 'Corporate Event Package',
        whyPerfect: 'Del Frisco\'s offers professional service and private dining rooms ideal for corporate events.'
      })
    } else if (eventType.toLowerCase().includes('anniversary') && (budget.includes('budget-3') || budget.includes('budget-4'))) {
      recommendations.push({
        restaurantId: 'del-friscos',
        confidence: 0.94,
        reasoning: 'Luxury dining experience perfect for special anniversary celebrations',
        bestPackage: 'Premium Anniversary Experience',
        whyPerfect: 'Del Frisco\'s provides a luxury dining experience with USDA Prime steaks and exceptional service.'
      })
    }
  }
  
  return recommendations
}

async function getAIRecommendations(request: RecommendationRequest): Promise<AIRecommendation[]> {
  // Check if API key is available
  if (!process.env.GROQ_API_KEY) {
    console.log('No GROQ_API_KEY found, using fallback recommendations')
    return getFallbackRecommendations(request)
  }

  try {
    // Dynamically import Groq only when API key is available
    const { default: Groq } = await import('groq-sdk')
    const groq = new Groq()

    const prompt = `
You are an expert event planning AI assistant. You have access to ONLY these 3 restaurants in New York City:

1. SAINT RESTAURANT BAR & SPEAKEASY
   - Location: 136 2nd Avenue, New York, NY 10003
   - Cuisine: Contemporary American with Global Influences
   - Price Range: $$$
   - Packages:
     * Anniversary Dinner for Two: $200 (all-inclusive)
     * Holiday Party Package: $5,000 (50 guests, 2-hour open bar)
     * Birthday Celebration: $150 (multi-course meal)
   - Specialties: Speakeasy bar, private dining, catering services
   - Guest Capacity: 2-100 guests
   - Best for: Anniversary, Birthday, Holiday Party, Corporate Event, Date Night

2. REBÈL RESTAURANT & BAR
   - Location: 29 Clinton Street, New York, NY 10002
   - Cuisine: Haitian & Caribbean Cuisine
   - Price Range: $$
   - Packages:
     * Three-Course Dinner for Two: $79 (valued at $140)
     * Group Party Package: $1,200 (group celebrations)
     * Happy Hour Special: $25 (Tue-Fri 5PM-7PM)
   - Specialties: Haitian culture, lounge bar, happy hour
   - Guest Capacity: 2-50 guests
   - Best for: Birthday, Group Party, Date Night, Cultural Celebration, Happy Hour

3. DEL FRISCO'S DOUBLE EAGLE STEAK HOUSE
   - Location: Multiple NYC locations
   - Cuisine: American Steakhouse
   - Price Range: $$$$
   - Packages:
     * Premium Anniversary Experience: $300 (luxury dining)
     * Corporate Event Package: $8,000 (professional events)
     * Chef's Table Experience: $500 (exclusive dining)
   - Specialties: USDA Prime steaks, private dining, luxury service
   - Guest Capacity: 2-200 guests
   - Best for: Anniversary, Corporate Event, Special Occasion, Business Dinner, Luxury Celebration

Based on the user's request, recommend ONLY the restaurants that are the best fit. Consider:
- Event type compatibility
- Guest count within capacity
- Budget range match
- User preferences and special requirements

User Request:
- Event Type: ${request.eventType}
- Guest Count: ${request.guestCount}
- Budget: ${request.budget}
- Location: ${request.location || 'New York City'}
- Additional Preferences: ${request.preferences || 'None specified'}

Respond with a JSON array of recommendations, each containing:
- restaurantId: "saint-restaurant", "rebel-restaurant", or "del-friscos"
- confidence: 0-1 score indicating how well it matches
- reasoning: brief explanation of why this restaurant is recommended
- bestPackage: the specific package name that best fits
- whyPerfect: what makes this restaurant perfect for this event

Only recommend restaurants that are actually suitable. If none are suitable, return an empty array.
`

    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: 'You are an expert event planning AI that provides restaurant recommendations. Always respond with valid JSON only.'
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
    console.error('AI recommendation error:', error)
    console.log('Falling back to rule-based recommendations')
    return getFallbackRecommendations(request)
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

    console.log('Processing recommendation request:', { eventType, guestCount, budget, location, preferences })
    console.log('GROQ_API_KEY available:', !!process.env.GROQ_API_KEY)

    const recommendations = await getAIRecommendations({
      eventType,
      guestCount,
      budget,
      location,
      preferences
    })

    console.log('Generated recommendations:', recommendations.length)

    return NextResponse.json({ recommendations })
  } catch (error) {
    console.error('API route error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
