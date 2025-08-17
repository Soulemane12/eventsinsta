import Groq from 'groq-sdk'
import { Restaurant } from '../data/restaurants'

const groq = new Groq()

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

export async function getAIRecommendations(request: RecommendationRequest): Promise<AIRecommendation[]> {
  try {
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
    return []
  }
}

export async function getPersonalizedRecommendation(request: RecommendationRequest): Promise<AIRecommendation | null> {
  const recommendations = await getAIRecommendations(request)
  return recommendations.length > 0 ? recommendations[0] : null
}
