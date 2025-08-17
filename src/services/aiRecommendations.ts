import Groq from 'groq-sdk'
import { Restaurant, RESTAURANTS } from '../data/restaurants'

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || '',
})

interface UserPreferences {
  eventType: string
  guestCount: number
  budget: string
  location?: string
  occasion?: string
  dietaryRestrictions?: string[]
  atmosphere?: string
  specialRequirements?: string[]
}

interface AIRecommendation {
  restaurantId: string
  confidence: number
  reasoning: string
  bestPackage: string
  whyPerfect: string
}

export async function getAIRecommendations(preferences: UserPreferences): Promise<AIRecommendation[]> {
  try {
    const systemPrompt = `You are an expert event planner and restaurant consultant. Your job is to analyze user preferences and recommend the best restaurants from the available options.

Available restaurants:
${RESTAURANTS.map(restaurant => `
- ${restaurant.name} (${restaurant.id})
  Cuisine: ${restaurant.cuisine}
  Price Range: ${restaurant.priceRange}
  Guest Capacity: ${restaurant.guestRange.min}-${restaurant.guestRange.max}
  Event Types: ${restaurant.eventTypes.join(', ')}
  Packages: ${restaurant.packages.map(p => `${p.name} ($${p.price})`).join(', ')}
  Features: ${restaurant.features.join(', ')}
`).join('\n')}

Analyze the user's preferences and return ONLY the top 1-2 most suitable restaurants. Consider:
1. Event type compatibility
2. Guest count within capacity
3. Budget appropriateness
4. Atmosphere and occasion fit
5. Special requirements

Return a JSON array with objects containing:
- restaurantId: the ID of the recommended restaurant
- confidence: 0-1 score indicating how perfect the match is
- reasoning: brief explanation of why this restaurant is recommended
- bestPackage: the most suitable package name
- whyPerfect: 1-2 sentences explaining why this is the perfect choice

Only recommend restaurants that are truly excellent matches. If no restaurant is a good fit, return an empty array.`

    const userPrompt = `User Preferences:
- Event Type: ${preferences.eventType}
- Guest Count: ${preferences.guestCount}
- Budget: ${preferences.budget}
- Location: ${preferences.location || 'Not specified'}
- Occasion: ${preferences.occasion || 'Not specified'}
- Dietary Restrictions: ${preferences.dietaryRestrictions?.join(', ') || 'None'}
- Atmosphere: ${preferences.atmosphere || 'Not specified'}
- Special Requirements: ${preferences.specialRequirements?.join(', ') || 'None'}

Please recommend the best restaurants for this event.`

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: userPrompt
        }
      ],
      model: "mixtral-8x7b-32768",
      temperature: 0.3,
      max_tokens: 1000,
    })

    const response = completion.choices[0]?.message?.content
    if (!response) {
      throw new Error('No response from AI')
    }

    // Parse the JSON response
    const recommendations = JSON.parse(response) as AIRecommendation[]
    return recommendations

  } catch (error) {
    console.error('AI recommendation error:', error)
    // Fallback to basic filtering if AI fails
    return getFallbackRecommendations(preferences)
  }
}

function getFallbackRecommendations(preferences: UserPreferences): AIRecommendation[] {
  const matchingRestaurants = RESTAURANTS.filter(restaurant => {
    const supportsEventType = restaurant.eventTypes.some(type => 
      type.toLowerCase().includes(preferences.eventType.toLowerCase())
    )
    const supportsGuestCount = preferences.guestCount >= restaurant.guestRange.min && 
                              preferences.guestCount <= restaurant.guestRange.max
    
    return supportsEventType && supportsGuestCount
  })

  return matchingRestaurants.slice(0, 2).map(restaurant => ({
    restaurantId: restaurant.id,
    confidence: 0.7,
    reasoning: `Matches your ${preferences.eventType} event and guest count`,
    bestPackage: restaurant.packages[0]?.name || 'Contact for pricing',
    whyPerfect: `Perfect for ${preferences.eventType} celebrations with ${preferences.guestCount} guests`
  }))
}

export function getRestaurantById(id: string): Restaurant | undefined {
  return RESTAURANTS.find(restaurant => restaurant.id === id)
}
