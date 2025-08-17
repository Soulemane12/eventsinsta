'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AIRestaurantCard from '../../components/AIRestaurantCard'
import { RESTAURANTS } from '../../data/restaurants'
import { getAIRecommendations } from '../../services/aiRecommendation'

const BrandPurple = 'bg-purple-800'
const BrandPurpleHover = 'hover:bg-purple-900'

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

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-2xl bg-white shadow ${className}`}>{children}</div>
}

interface AIRecommendation {
  restaurantId: string
  confidence: number
  reasoning: string
  bestPackage: string
  whyPerfect: string
}

const TEST_SCENARIOS = [
  {
    name: 'Romantic Anniversary Dinner',
    eventType: 'Anniversary',
    guestCount: 2,
    budget: 'budget-2',
    description: 'Perfect for a romantic anniversary celebration'
  },
  {
    name: 'Birthday Party for 25',
    eventType: 'Birthday Party',
    guestCount: 25,
    budget: 'budget-3',
    description: 'Great for a medium-sized birthday celebration'
  },
  {
    name: 'Holiday Party for 50',
    eventType: 'Holiday Party',
    guestCount: 50,
    budget: 'budget-4',
    description: 'Perfect for a large holiday gathering'
  },
  {
    name: 'Small Budget Birthday',
    eventType: 'Birthday Party',
    guestCount: 10,
    budget: 'budget-1',
    description: 'Budget-friendly birthday celebration'
  },
  {
    name: 'Large Corporate Event',
    eventType: 'Corporate Event',
    guestCount: 100,
    budget: 'budget-4',
    description: 'Large corporate gathering'
  },
  {
    name: 'No Match Scenario',
    eventType: 'Wedding',
    guestCount: 1,
    budget: 'budget-1',
    description: 'Should return no matches (single guest wedding)'
  }
]

export default function RestaurantTest() {
  const router = useRouter()
  const [selectedScenario, setSelectedScenario] = useState(TEST_SCENARIOS[0])
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([])
  const [loading, setLoading] = useState(false)

  const getRecommendationForRestaurant = (restaurantId: string) => {
    return recommendations.find(rec => rec.restaurantId === restaurantId)
  }

  const recommendedRestaurants = RESTAURANTS.filter(restaurant =>
    recommendations.some(rec => rec.restaurantId === restaurant.id)
  )

  async function testRecommendations() {
    setLoading(true)
    try {
      const results = await getAIRecommendations({
        eventType: selectedScenario.eventType,
        guestCount: selectedScenario.guestCount,
        budget: selectedScenario.budget,
        location: 'New York, NY'
      })
      setRecommendations(results)
    } catch (error) {
      console.error('Failed to get recommendations:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    testRecommendations()
  }, [selectedScenario])

  return (
    <div className="max-w-md mx-auto min-h-screen bg-gray-50">
      <div className="sticky top-0 bg-white z-10">
        <div className="flex items-center gap-2 p-4">
          <button onClick={() => router.back()} className="w-9 h-9 grid place-items-center rounded-full hover:bg-gray-100" aria-label="Back">
            ←
          </button>
          <div className="text-2xl font-semibold">Restaurant Recommendations Test</div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">🍽️ Restaurant Matching Test</h2>
          <p className="text-sm text-gray-600">Test different event scenarios to see restaurant recommendations</p>
        </div>

        {/* Scenario Selection */}
        <Card className="p-4">
          <div className="text-sm font-medium text-purple-800 mb-3">Select Test Scenario</div>
          <div className="space-y-2">
            {TEST_SCENARIOS.map((scenario, index) => (
              <button
                key={index}
                onClick={() => setSelectedScenario(scenario)}
                className={`w-full p-3 text-left rounded-lg transition-colors ${
                  selectedScenario === scenario 
                    ? 'bg-purple-100 border-2 border-purple-600' 
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <div className="font-medium text-sm">{scenario.name}</div>
                <div className="text-xs text-gray-600">{scenario.description}</div>
                <div className="text-xs text-purple-600 mt-1">
                  {scenario.eventType} • {scenario.guestCount} guests • {scenario.budget}
                </div>
              </button>
            ))}
          </div>
        </Card>

        {/* Current Scenario Details */}
        <Card className="p-4">
          <div className="text-sm font-medium text-purple-800 mb-2">Current Test Scenario</div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>🎉 {selectedScenario.eventType}</div>
            <div>👥 {selectedScenario.guestCount} guests</div>
            <div>💰 {selectedScenario.budget === 'budget-1' ? '$500-1,000' : 
                      selectedScenario.budget === 'budget-2' ? '$1,000-3,000' :
                      selectedScenario.budget === 'budget-3' ? '$3,000-5,000' : '$5,000+'}</div>
            <div>📍 New York, NY</div>
          </div>
        </Card>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-sm text-gray-600">Finding restaurants for your event...</p>
          </div>
        )}

        {/* Recommendations */}
        {!loading && recommendedRestaurants.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-3">🍽️ Recommended Restaurants</h3>
            <div className="space-y-4">
              {recommendedRestaurants.map((restaurant) => (
                <AIRestaurantCard
                  key={restaurant.id}
                  restaurant={restaurant}
                  aiRecommendation={getRecommendationForRestaurant(restaurant.id)}
                  onSelect={() => {}}
                  isSelected={false}
                  showDetails={true}
                />
              ))}
            </div>
          </div>
        )}

        {/* No Recommendations */}
        {!loading && recommendations.length === 0 && (
          <div className="bg-yellow-50 p-6 rounded-2xl text-center">
            <div className="text-yellow-800 font-medium mb-2">No Matches Found</div>
            <div className="text-yellow-700 text-sm mb-4">
              We couldn't find restaurants that match your event requirements among our current partners.
              <br /><br />
              <strong>Current Scenario:</strong><br />
              • Event Type: {selectedScenario.eventType}<br />
              • Guest Count: {selectedScenario.guestCount} guests<br />
              • Budget: ${selectedScenario.budget === 'budget-2' ? '1,000-3,000' :
                        selectedScenario.budget === 'budget-4' ? '5,000+' : '500-1,000'}<br /><br />
              <strong>Why no matches?</strong><br />
              This could be due to:
              <ul className="mt-2 text-left max-w-md mx-auto space-y-1">
                <li>• Guest count outside restaurant capacities (2-200 guests supported)</li>
                <li>• Budget range mismatch with available packages</li>
                <li>• Event type not currently supported by our partners</li>
                <li>• Specific requirements not met by available options</li>
              </ul>
            </div>
            <div className="text-xs text-yellow-600">
              💡 Try a different scenario or adjust the parameters to see restaurant recommendations in action!
            </div>
          </div>
        )}

        {/* API Key Notice */}
        <div className="mt-8 bg-blue-50 p-4 rounded-xl">
          <h3 className="text-sm font-semibold text-blue-800 mb-2">🔑 API Key Required</h3>
          <p className="text-blue-700 text-sm">
            To test the restaurant recommendations, you need to set your Groq API key in the environment variables.
            Add <code className="bg-blue-100 px-1 rounded">GROQ_API_KEY=your_key_here</code> to your <code className="bg-blue-100 px-1 rounded">.env.local</code> file.
          </p>
        </div>
      </div>
    </div>
  )
}
