import { SportsArena } from '../data/sportsArenas'

interface RecommendationRequest {
  eventType: string
  guestCount: number
  budget: string
  location?: string
  preferences?: string
}

interface AIRecommendation {
  arenaId: string
  confidence: number
  reasoning: string
  bestPackage: string
  whyPerfect: string
}

// Fallback recommendation logic when API is not available
function getFallbackRecommendations(request: RecommendationRequest): AIRecommendation[] {
  const { eventType, guestCount, budget } = request
  
  const recommendations: AIRecommendation[] = []
  
  // Madison Square Garden - premium for all events
  if (guestCount >= 20 && guestCount <= 200) {
    if (eventType.toLowerCase().includes('birthday') || eventType.toLowerCase().includes('sporting')) {
      recommendations.push({
        arenaId: 'madison-square-garden',
        confidence: 0.98,
        reasoning: 'The World\'s Most Famous Arena perfect for premium sporting events and celebrations',
        bestPackage: 'Premium Suite Experience',
        whyPerfect: 'Madison Square Garden offers the ultimate sports and entertainment experience with premium suites and exclusive access.'
      })
    } else if (eventType.toLowerCase().includes('corporate') || eventType.toLowerCase().includes('special')) {
      recommendations.push({
        arenaId: 'madison-square-garden',
        confidence: 0.95,
        reasoning: 'Iconic venue perfect for corporate events and special occasions',
        bestPackage: 'Group Event Package',
        whyPerfect: 'Madison Square Garden provides a prestigious setting for corporate events with premium amenities.'
      })
    }
  }
  
  // Barclays Center - great for Brooklyn events
  if (guestCount >= 20 && guestCount <= 200) {
    if (eventType.toLowerCase().includes('birthday') || eventType.toLowerCase().includes('group')) {
      recommendations.push({
        arenaId: 'barclays-center',
        confidence: 0.92,
        reasoning: 'Brooklyn\'s premier venue perfect for group celebrations and sporting events',
        bestPackage: 'Premium Suite Experience',
        whyPerfect: 'Barclays Center offers state-of-the-art facilities with premium amenities for memorable group events.'
      })
    } else if (eventType.toLowerCase().includes('sporting') || eventType.toLowerCase().includes('basketball')) {
      recommendations.push({
        arenaId: 'barclays-center',
        confidence: 0.94,
        reasoning: 'Home of the Brooklyn Nets, perfect for basketball and sporting events',
        bestPackage: 'Group Event Package',
        whyPerfect: 'Barclays Center is the home of the Brooklyn Nets and offers world-class sporting experiences.'
      })
    }
  }
  
  // Yankee Stadium - perfect for baseball and large events
  if (guestCount >= 20 && guestCount <= 200) {
    if (eventType.toLowerCase().includes('sporting') || eventType.toLowerCase().includes('baseball')) {
      recommendations.push({
        arenaId: 'yankee-stadium',
        confidence: 0.96,
        reasoning: 'Iconic baseball stadium perfect for sporting events and large celebrations',
        bestPackage: 'Premium Suite Experience',
        whyPerfect: 'Yankee Stadium offers the rich history and tradition of baseball in a state-of-the-art facility.'
      })
    } else if (eventType.toLowerCase().includes('corporate') && guestCount >= 50) {
      recommendations.push({
        arenaId: 'yankee-stadium',
        confidence: 0.90,
        reasoning: 'Large capacity venue perfect for corporate events and team building',
        bestPackage: 'Large Group Event',
        whyPerfect: 'Yankee Stadium provides ample space and premium amenities for large corporate gatherings.'
      })
    }
  }
  
  return recommendations
}

export async function getAISportsArenaRecommendations(request: RecommendationRequest): Promise<AIRecommendation[]> {
  try {
    // Try to use the API route first
    const response = await fetch('/api/sports-arena-recommendations', {
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
    console.error('Failed to fetch AI sports arena recommendations:', error)
    console.log('Using fallback recommendation logic')
    return getFallbackRecommendations(request)
  }
}

export async function getPersonalizedSportsArenaRecommendation(request: RecommendationRequest): Promise<AIRecommendation | null> {
  const recommendations = await getAISportsArenaRecommendations(request)
  return recommendations.length > 0 ? recommendations[0] : null
}
