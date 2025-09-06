import { NextRequest, NextResponse } from 'next/server'
import { SPORTS_ARENAS } from '../../../data/sportsArenas'

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

async function getAISportsArenaRecommendations(request: RecommendationRequest): Promise<AIRecommendation[]> {
  if (!process.env.GROQ_API_KEY) {
    throw new Error('GROQ_API_KEY is not configured')
  }

  const prompt = `For a ${request.eventType} with ${request.guestCount} guests and budget ${request.budget}, return ONLY a JSON array with appropriate sports arenas from this list:

${SPORTS_ARENAS.map(arena => `- ${arena.id}: ${arena.name} (${arena.sportType}) - Capacity: ${arena.guestRange.min}-${arena.guestRange.max} guests`).join('\n')}

VERY SPECIFIC FILTERING RULES WITH DETAILED EXAMPLES:

🚨 CRITICAL: If event type is "Vacation", ONLY include these arenas: madison-square-garden, barclays-center, yankee-stadium. NEVER exclude sports arenas for vacation events.

1. BIRTHDAY PARTY + SPORTS ARENA:
   ✅ INCLUDE: madison-square-garden, barclays-center, yankee-stadium
   ❌ EXCLUDE: None - all sports arenas are suitable for birthday parties
   📝 EXAMPLE: Birthday party at sports arena - needs premium venue with sports atmosphere, suite experiences, group packages

2. SPORTING EVENTS + SPORTS ARENA:
   ✅ INCLUDE: madison-square-garden, barclays-center, yankee-stadium
   ❌ EXCLUDE: None - all sports arenas are perfect for sporting events
   📝 EXAMPLE: Sporting event at arena - needs authentic sports venue, premium seating, group packages

3. CORPORATE EVENTS + SPORTS ARENA:
   ✅ INCLUDE: madison-square-garden, barclays-center, yankee-stadium
   ❌ EXCLUDE: None - all sports arenas are suitable for corporate events
   📝 EXAMPLE: Corporate event at arena - needs premium venue, suite experiences, professional amenities

4. VACATION + SPORTS ARENA:
   ✅ INCLUDE: madison-square-garden, barclays-center, yankee-stadium
   ❌ EXCLUDE: None - all sports arenas are suitable for vacation experiences
   📝 EXAMPLE: Vacation at sports arena - needs premium venue experience, suite access, memorable activities

CRITICAL INSTRUCTIONS: 
1. Return ONLY the JSON array, no other text. Start with [ and end with ].
2. Use the EXACT event type "${request.eventType}" in your reasoning
3. Follow the filtering rules EXACTLY - only include arenas from the INCLUDE lists
4. NEVER exclude sports arenas - they are all suitable for sports arena events
5. For all event types, prioritize premium experiences and suite packages
6. For large groups (50+ guests), emphasize group packages and premium amenities
7. For smaller groups (20-50 guests), focus on suite experiences and intimate settings

SPECIFIC EXAMPLES OF PERFECT MATCHES:
- Birthday Party + Sports Arena: "Perfect for Birthday Party sports experience" (Madison Square Garden), "Perfect for Birthday Party premium venue" (Barclays Center)
- Sporting Events + Sports Arena: "Perfect for Sporting Events authentic experience" (Madison Square Garden), "Perfect for Sporting Events basketball venue" (Barclays Center)
- Corporate Events + Sports Arena: "Perfect for Corporate Events premium venue" (Madison Square Garden), "Perfect for Corporate Events professional setting" (Barclays Center)
- Vacation + Sports Arena: "Perfect for Vacation premium experience" (Madison Square Garden), "Perfect for Vacation memorable venue" (Barclays Center)

Example format:
[
  {
    "arenaId": "madison-square-garden",
    "confidence": 0.9,
    "reasoning": "Perfect for ${request.eventType} premium sports experience",
    "bestPackage": "Premium Suite Experience",
    "whyPerfect": "The World's Most Famous Arena with premium suites and exclusive access"
  }
]`

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          {
            role: 'system',
            content: 'You are an expert event planner specializing in sports arena recommendations. You provide precise, context-aware recommendations for sports venues based on event type, guest count, and budget. Always respond with valid JSON arrays only.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 2000,
      }),
    })

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status}`)
    }

    const data = await response.json()
    const content = data.choices[0]?.message?.content

    if (!content) {
      throw new Error('No content received from AI')
    }

    // Parse the JSON response
    const recommendations = JSON.parse(content)
    
    if (!Array.isArray(recommendations)) {
      throw new Error('AI response is not an array')
    }

    return recommendations
  } catch (error) {
    console.error('AI Sports Arena Recommendation Error:', error)
    throw error
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: RecommendationRequest = await request.json()
    console.log('Sports Arena API Request:', body)
    
    // For now, let's use fallback recommendations to test
    const fallbackRecommendations = [
      {
        arenaId: 'madison-square-garden',
        confidence: 0.95,
        reasoning: 'The World\'s Most Famous Arena perfect for premium sporting events and celebrations',
        bestPackage: 'Premium Suite Experience',
        whyPerfect: 'Madison Square Garden offers the ultimate sports and entertainment experience with premium suites and exclusive access.'
      },
      {
        arenaId: 'barclays-center',
        confidence: 0.90,
        reasoning: 'Brooklyn\'s premier venue perfect for group celebrations and sporting events',
        bestPackage: 'Premium Suite Experience',
        whyPerfect: 'Barclays Center offers state-of-the-art facilities with premium amenities for memorable group events.'
      }
    ]
    
    console.log('Sports Arena API Response (fallback):', fallbackRecommendations)
    
    return NextResponse.json({ recommendations: fallbackRecommendations })
  } catch (error) {
    console.error('Sports Arena Recommendation API Error:', error)
    return NextResponse.json(
      { 
        error: 'AI filtering is not working. Showing all services. Please check the AI service configuration or try again later.',
        recommendations: []
      },
      { status: 500 }
    )
  }
}
