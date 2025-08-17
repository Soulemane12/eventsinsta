'use client'

import { useState } from 'react'
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

const TEST_SCENARIOS = [
  {
    id: 'anniversary-2',
    title: 'Anniversary Dinner for 2',
    eventType: 'Anniversary',
    guestCount: 2,
    budget: 'budget-2',
    description: 'Romantic anniversary celebration'
  },
  {
    id: 'holiday-50',
    title: 'Holiday Party for 50',
    eventType: 'Holiday Party',
    guestCount: 50,
    budget: 'budget-4',
    description: 'Large holiday celebration with open bar'
  },
  {
    id: 'birthday-20',
    title: 'Birthday Party for 20',
    eventType: 'Birthday',
    guestCount: 20,
    budget: 'budget-2',
    description: 'Birthday celebration with friends'
  }
]

interface AIRecommendation {
  restaurantId: string
  confidence: number
  reasoning: string
  bestPackage: string
  whyPerfect: string
}

export default function AITest() {
  const [selectedScenario, setSelectedScenario] = useState(TEST_SCENARIOS[0])
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedRestaurant, setSelectedRestaurant] = useState<string>('')

  const testRecommendation = async (scenario: typeof TEST_SCENARIOS[0]) => {
    setSelectedScenario(scenario)
    setLoading(true)
    setSelectedRestaurant('')
    
    try {
      const results = await getAIRecommendations({
        eventType: scenario.eventType,
        guestCount: scenario.guestCount,
        budget: scenario.budget,
        location: 'New York, NY'
      })
      setRecommendations(results)
    } catch (error) {
      console.error('AI recommendation failed:', error)
      setRecommendations([])
    } finally {
      setLoading(false)
    }
  }

  const getRecommendationForRestaurant = (restaurantId: string) => {
    return recommendations.find(rec => rec.restaurantId === restaurantId)
  }

  const recommendedRestaurants = RESTAURANTS.filter(restaurant => 
    recommendations.some(rec => rec.restaurantId === restaurant.id)
  )

  return (
    <div className="max-w-4xl mx-auto min-h-screen bg-gray-50 p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-purple-800 mb-2">🤖 AI Restaurant Recommendation Test</h1>
        <p className="text-gray-600">Test our AI-powered restaurant matching system</p>
      </div>

      {/* Test Scenarios */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Choose a Test Scenario</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {TEST_SCENARIOS.map((scenario) => (
            <button
              key={scenario.id}
              onClick={() => testRecommendation(scenario)}
              className={`p-4 rounded-2xl border-2 transition-all text-left ${
                selectedScenario.id === scenario.id
                  ? 'border-purple-600 bg-purple-50'
                  : 'border-gray-200 hover:border-purple-300 bg-white'
              }`}
            >
              <h3 className="font-semibold text-gray-900 mb-1">{scenario.title}</h3>
              <p className="text-sm text-gray-600 mb-2">{scenario.description}</p>
              <div className="text-xs text-gray-500 space-y-1">
                <div>🎉 {scenario.eventType}</div>
                <div>👥 {scenario.guestCount} guests</div>
                <div>💰 ${scenario.budget === 'budget-2' ? '1,000-3,000' : 
                         scenario.budget === 'budget-4' ? '5,000+' : '500-1,000'}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Current Scenario */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Current Test: {selectedScenario.title}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="bg-purple-50 p-3 rounded-lg">
            <div className="font-medium text-purple-800">Event Type</div>
            <div className="text-gray-700">{selectedScenario.eventType}</div>
          </div>
          <div className="bg-purple-50 p-3 rounded-lg">
            <div className="font-medium text-purple-800">Guest Count</div>
            <div className="text-gray-700">{selectedScenario.guestCount} guests</div>
          </div>
          <div className="bg-purple-50 p-3 rounded-lg">
            <div className="font-medium text-purple-800">Budget Range</div>
            <div className="text-gray-700">
              ${selectedScenario.budget === 'budget-2' ? '1,000-3,000' : 
                selectedScenario.budget === 'budget-4' ? '5,000+' : '500-1,000'}
            </div>
          </div>
          <div className="bg-purple-50 p-3 rounded-lg">
            <div className="font-medium text-purple-800">AI Matches</div>
            <div className="text-gray-700">{recommendations.length} restaurants</div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">AI is analyzing your event requirements...</p>
        </div>
      )}

      {/* AI Recommendations */}
      {!loading && recommendedRestaurants.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">
            🍽️ AI Recommendations ({recommendations.length} found)
          </h2>
          <div className="grid gap-6">
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
      {!loading && recommendations.length === 0 && (
        <div className="bg-yellow-50 p-6 rounded-2xl text-center">
          <div className="text-yellow-800 font-medium mb-2">🤖 AI Analysis: No Matches Found</div>
          <div className="text-yellow-700 text-sm mb-4">
            The AI analyzed your event requirements and couldn't find a suitable match among our 3 restaurant partners.
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
            💡 Try a different scenario or adjust the parameters to see AI recommendations in action!
          </div>
        </div>
      )}

      {/* API Key Notice */}
      <div className="mt-8 bg-blue-50 p-4 rounded-xl">
        <h3 className="text-sm font-semibold text-blue-800 mb-2">🔑 API Key Required</h3>
        <p className="text-blue-700 text-sm">
          To test the AI recommendations, you need to set your Groq API key in the environment variables.
          Add <code className="bg-blue-100 px-1 rounded">GROQ_API_KEY=your_key_here</code> to your <code className="bg-blue-100 px-1 rounded">.env.local</code> file.
        </p>
      </div>
    </div>
  )
}
