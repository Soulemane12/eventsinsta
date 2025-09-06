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

VERY SPECIFIC FILTERING RULES WITH EXAMPLES:

1. BIRTHDAY PARTY + RESTAURANT:
   ✅ INCLUDE: dj-ceo, dj-standard, photographer-premium, photographer-standard, catering-premium, catering-standard, decorations-premium, decorations-standard, exotic-car-bmw-2025, exotic-car-rolls-royce-ghost, exotic-car-mercedes-gwagon, exotic-car-range-rover, car-service-premium, car-service-standard, isit-corp, makeup-premium, makeup-standard, entertainment-live-band, entertainment-magician
   ❌ EXCLUDE: kids-birthday-package, sports-knicks-birthday, sports-knicks-jersey-signing, boxing-lessons-eric-kelly, golf-lessons-access, yacht-party-jboogie, baby-shower-package, wedding-metropolitan-package, wedding-venues, wellness-midtown-biohack, wellness-platinum-spa, coaching-ifs-ty-cutner

2. BIRTHDAY PARTY + SPORTS ARENA:
   ✅ INCLUDE: sports-knicks-birthday, sports-knicks-jersey-signing, boxing-lessons-eric-kelly, golf-lessons-access, dj-ceo, dj-standard, photographer-premium, photographer-standard, catering-premium, catering-standard
   ❌ EXCLUDE: kids-birthday-package, yacht-party-jboogie, baby-shower-package, wedding-metropolitan-package, wedding-venues, wellness-midtown-biohack, wellness-platinum-spa, coaching-ifs-ty-cutner, makeup-premium, makeup-standard, barber-mobile, exotic-car-bmw-2025, exotic-car-rolls-royce-ghost, exotic-car-mercedes-gwagon, exotic-car-range-rover, car-service-premium, car-service-standard, isit-corp, decorations-premium, decorations-standard, entertainment-live-band, entertainment-magician

3. BIRTHDAY PARTY + PRIVATE HOME:
   ✅ INCLUDE: dj-ceo, dj-standard, photographer-premium, photographer-standard, catering-premium, catering-standard, decorations-premium, decorations-standard, exotic-car-bmw-2025, exotic-car-rolls-royce-ghost, exotic-car-mercedes-gwagon, exotic-car-range-rover, car-service-premium, car-service-standard, isit-corp, makeup-premium, makeup-standard, entertainment-live-band, entertainment-magician
   ❌ EXCLUDE: kids-birthday-package, sports-knicks-birthday, sports-knicks-jersey-signing, boxing-lessons-eric-kelly, golf-lessons-access, yacht-party-jboogie, baby-shower-package, wedding-metropolitan-package, wedding-venues, wellness-midtown-biohack, wellness-platinum-spa, coaching-ifs-ty-cutner

4. SPORTING EVENTS + ANY VENUE:
   ✅ INCLUDE: sports-knicks-birthday, sports-knicks-jersey-signing, boxing-lessons-eric-kelly, golf-lessons-access, dj-ceo, dj-standard, photographer-premium, photographer-standard, catering-premium, catering-standard
   ❌ EXCLUDE: kids-birthday-package, yacht-party-jboogie, baby-shower-package, wedding-metropolitan-package, wedding-venues, wellness-midtown-biohack, wellness-platinum-spa, coaching-ifs-ty-cutner, makeup-premium, makeup-standard, barber-mobile

5. WEDDING + ANY VENUE:
   ✅ INCLUDE: wedding-metropolitan-package, wedding-venues, dj-ceo, dj-standard, photographer-premium, photographer-standard, catering-premium, catering-standard, makeup-premium, makeup-standard, decorations-premium, decorations-standard, exotic-car-bmw-2025, exotic-car-rolls-royce-ghost, exotic-car-mercedes-gwagon, exotic-car-range-rover, car-service-premium, car-service-standard, isit-corp
   ❌ EXCLUDE: kids-birthday-package, sports-knicks-birthday, sports-knicks-jersey-signing, boxing-lessons-eric-kelly, golf-lessons-access, yacht-party-jboogie, baby-shower-package, wellness-midtown-biohack, wellness-platinum-spa, coaching-ifs-ty-cutner

6. BABY SHOWER + ANY VENUE:
   ✅ INCLUDE: baby-shower-package, photographer-premium, photographer-standard, catering-premium, catering-standard, decorations-premium, decorations-standard, entertainment-magician
   ❌ EXCLUDE: kids-birthday-package, sports-knicks-birthday, sports-knicks-jersey-signing, boxing-lessons-eric-kelly, golf-lessons-access, yacht-party-jboogie, wedding-metropolitan-package, wedding-venues, wellness-midtown-biohack, wellness-platinum-spa, coaching-ifs-ty-cutner, makeup-premium, makeup-standard, barber-mobile

7. CORPORATE EVENTS + ANY VENUE:
   ✅ INCLUDE: dj-ceo, dj-standard, photographer-premium, photographer-standard, catering-premium, catering-standard, decorations-premium, decorations-standard, car-service-premium, car-service-standard, isit-corp, entertainment-live-band, entertainment-magician
   ❌ EXCLUDE: kids-birthday-package, sports-knicks-birthday, sports-knicks-jersey-signing, boxing-lessons-eric-kelly, golf-lessons-access, yacht-party-jboogie, baby-shower-package, wedding-metropolitan-package, wedding-venues, wellness-midtown-biohack, wellness-platinum-spa, coaching-ifs-ty-cutner, makeup-premium, makeup-standard, barber-mobile

8. HEALTH & WELLNESS + ANY VENUE:
   ✅ INCLUDE: wellness-midtown-biohack, wellness-platinum-spa, coaching-ifs-ty-cutner, photographer-premium, photographer-standard, catering-premium, catering-standard
   ❌ EXCLUDE: kids-birthday-package, sports-knicks-birthday, sports-knicks-jersey-signing, boxing-lessons-eric-kelly, golf-lessons-access, yacht-party-jboogie, baby-shower-package, wedding-metropolitan-package, wedding-venues, makeup-premium, makeup-standard, barber-mobile, entertainment-live-band, entertainment-magician

CRITICAL: 
1. Return ONLY the JSON array, no other text. Start with [ and end with ].
2. Use the EXACT event type "${request.eventType}" in your reasoning
3. Follow the filtering rules EXACTLY - only include services from the INCLUDE lists
4. NEVER include services from the EXCLUDE lists
5. For SPORTS ARENA venues, PRIORITIZE sports services (sports-knicks-birthday, sports-knicks-jersey-signing, boxing-lessons-eric-kelly, golf-lessons-access) and put them FIRST in the array
6. For Birthday Party + Sports Arena, focus on SPORTS ACTIVITIES, not party decorations or exotic cars

Example format:
[
  {
    "serviceId": "dj-ceo",
    "confidence": 0.9,
    "reasoning": "Perfect for ${request.eventType} entertainment",
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