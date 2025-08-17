import { Restaurant } from '../data/restaurants'

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

// Fallback recommendation logic when API is not available
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

export async function getAIRecommendations(request: RecommendationRequest): Promise<AIRecommendation[]> {
  try {
    // Try to use the API route first
    const response = await fetch('/api/recommendations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    })

    if (response.ok) {
      const data = await response.json()
      return data.recommendations || []
    } else {
      console.warn('API route failed, using fallback recommendations')
      return getFallbackRecommendations(request)
    }
  } catch (error) {
    console.error('Failed to fetch AI recommendations:', error)
    console.log('Using fallback recommendation logic')
    return getFallbackRecommendations(request)
  }
}

export async function getPersonalizedRecommendation(request: RecommendationRequest): Promise<AIRecommendation | null> {
  const recommendations = await getAIRecommendations(request)
  return recommendations.length > 0 ? recommendations[0] : null
}
