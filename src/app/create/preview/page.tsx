'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AIRestaurantCard from '../../../components/AIRestaurantCard'
import { RESTAURANTS } from '../../../data/restaurants'
import { getAIRecommendations } from '../../../services/aiRecommendation'

const BrandPurple = 'bg-purple-800'
const BrandPurpleHover = 'hover:bg-purple-900'
const BrandText = 'text-purple-800'

function Button({ children, className = '', disabled, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      disabled={disabled}
      className={`w-full h-14 rounded-2xl ${BrandPurple} ${BrandPurpleHover} text-white font-semibold disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  )
}

function BackBtn() {
  const router = useRouter();
  return (
    <button onClick={() => router.back()} className="w-9 h-9 grid place-items-center rounded-full hover:bg-gray-100" aria-label="Back">
      ←
    </button>
  )
}

function StepHeader({ step, title }: { step: number; title: string }) {
  const pct = (step / 5) * 100
  return (
    <div className="sticky top-0 bg-white z-10">
      <div className="flex items-center gap-2 p-4">
        <BackBtn />
        <div className="text-2xl font-semibold">{step} of 5: {title}</div>
      </div>
      <div className="w-full h-1 bg-gray-200">
        <div className="h-1 bg-green-500" style={{ width: pct + '%' }} />
      </div>
    </div>
  )
}

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-2xl bg-white shadow ${className}`}>{children}</div>
}

// Mock data for demonstration - in a real app, this would come from URL params or state management
const MOCK_EVENT_DATA = {
  eventType: 'Anniversary',
  location: 'New York, NY',
  date: 'Dec 15, 2024',
  time: '7:00 PM',
  guestCount: 2,
  budget: 'budget-2' // $1,000 - $3,000
}

interface AIRecommendation {
  restaurantId: string
  confidence: number
  reasoning: string
  bestPackage: string
  whyPerfect: string
}

export default function Preview() {
  const router = useRouter()
  const [aiRecommendations, setAiRecommendations] = useState<AIRecommendation[]>([])
  const [selectedRestaurant, setSelectedRestaurant] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadRecommendations() {
      setLoading(true)
      try {
        const recommendations = await getAIRecommendations({
          eventType: MOCK_EVENT_DATA.eventType,
          guestCount: MOCK_EVENT_DATA.guestCount,
          budget: MOCK_EVENT_DATA.budget,
          location: MOCK_EVENT_DATA.location
        })
        setAiRecommendations(recommendations)
      } catch (error) {
        console.error('Failed to load AI recommendations:', error)
      } finally {
        setLoading(false)
      }
    }

    loadRecommendations()
  }, [])

  const getRecommendationForRestaurant = (restaurantId: string) => {
    return aiRecommendations.find(rec => rec.restaurantId === restaurantId)
  }

  const recommendedRestaurants = RESTAURANTS.filter(restaurant => 
    aiRecommendations.some(rec => rec.restaurantId === restaurant.id)
  )

  return (
    <div className="max-w-md mx-auto min-h-screen bg-gray-50">
      <StepHeader step={4} title="AI Restaurant Recommendations" />
      <div className="p-6 space-y-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">🤖 AI-Powered Restaurant Matches</h2>
          <p className="text-sm text-gray-600">Our AI has analyzed your event and found the perfect restaurants</p>
        </div>

        {/* Event Summary */}
        <Card className="p-4 bg-purple-50">
          <div className="text-sm font-medium text-purple-800 mb-2">Your Event Details</div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>🎉 {MOCK_EVENT_DATA.eventType}</div>
            <div>📍 {MOCK_EVENT_DATA.location}</div>
            <div>📅 {MOCK_EVENT_DATA.date}</div>
            <div>👥 {MOCK_EVENT_DATA.guestCount} guests</div>
            <div>💰 $1,000 - $3,000</div>
          </div>
        </Card>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-sm text-gray-600">AI is analyzing your event requirements...</p>
          </div>
        )}

        {/* AI Recommendations */}
        {!loading && recommendedRestaurants.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-3">🍽️ Recommended Restaurants</h3>
            <div className="space-y-4">
              {recommendedRestaurants.map((restaurant) => (
                <AIRestaurantCard
                  key={restaurant.id}
                  restaurant={restaurant}
                  aiRecommendation={getRecommendationForRestaurant(restaurant.id)}
                  onSelect={setSelectedRestaurant}
                  isSelected={selectedRestaurant === restaurant.id}
                  showDetails={true}
                />
              ))}
            </div>
          </div>
        )}

        {/* No Recommendations */}
        {!loading && recommendedRestaurants.length === 0 && (
          <div className="bg-yellow-50 p-6 rounded-2xl text-center">
            <div className="text-yellow-800 font-medium mb-2">No Perfect Matches Found</div>
            <div className="text-yellow-700 text-sm mb-4">
              Our AI couldn't find restaurants that perfectly match your criteria. Try adjusting your guest count or budget.
            </div>
            <button
              onClick={() => router.push('/create/guests')}
              className="px-4 py-2 bg-yellow-600 text-white rounded-lg text-sm font-medium hover:bg-yellow-700"
            >
              Adjust Event Details
            </button>
          </div>
        )}

        {/* Success Message */}
        {selectedRestaurant && (
          <div className="bg-green-50 p-4 rounded-xl">
            <div className="text-sm font-medium text-green-800 mb-2">✅ Restaurant Selected!</div>
            <div className="text-xs text-green-700">
              Great choice! This restaurant is perfect for your {MOCK_EVENT_DATA.eventType.toLowerCase()} celebration.
            </div>
          </div>
        )}

        <Button 
          onClick={()=>router.push('/create/review')} 
          disabled={!selectedRestaurant}
        >
          Next: Book & Celebrate!
        </Button>
      </div>
    </div>
  )
}
