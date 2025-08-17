'use client'

import { useState, useEffect } from 'react'
import AIRestaurantCard from '../../components/AIRestaurantCard'
import { getAIRecommendations, getRestaurantById } from '../../services/aiRecommendations'

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

const AI_DEMO_SCENARIOS = [
  {
    id: 'romantic-anniversary',
    title: 'Romantic Anniversary',
    description: 'Intimate anniversary dinner for a couple',
    preferences: {
      eventType: 'Anniversary',
      guestCount: 2,
      budget: 'budget-2',
      location: 'New York, NY',
      occasion: 'Romantic anniversary',
      atmosphere: 'romantic',
      specialRequirements: ['private dining', 'wine pairing', 'candlelit ambiance']
    }
  },
  {
    id: 'corporate-holiday',
    title: 'Corporate Holiday Party',
    description: 'Large corporate holiday celebration',
    preferences: {
      eventType: 'Holiday Party',
      guestCount: 50,
      budget: 'budget-4',
      location: 'New York, NY',
      occasion: 'Corporate holiday party',
      atmosphere: 'professional',
      specialRequirements: ['open bar', 'private dining', 'corporate catering']
    }
  },
  {
    id: 'birthday-celebration',
    title: 'Birthday Celebration',
    description: 'Fun birthday party with friends',
    preferences: {
      eventType: 'Birthday',
      guestCount: 20,
      budget: 'budget-2',
      location: 'New York, NY',
      occasion: 'Birthday celebration',
      atmosphere: 'fun and lively',
      specialRequirements: ['group dining', 'entertainment', 'birthday decorations']
    }
  }
]

interface AIRecommendation {
  restaurantId: string
  confidence: number
  reasoning: string
  bestPackage: string
  whyPerfect: string
}

export default function AIDemo() {
  const [selectedScenario, setSelectedScenario] = useState(AI_DEMO_SCENARIOS[0])
  const [aiRecommendations, setAiRecommendations] = useState<AIRecommendation[]>([])
  const [selectedRestaurant, setSelectedRestaurant] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)

  const updateScenario = async (scenario: typeof AI_DEMO_SCENARIOS[0]) => {
    setSelectedScenario(scenario)
    setSelectedRestaurant('')
    setIsLoading(true)
    
    try {
      const recommendations = await getAIRecommendations(scenario.preferences)
      setAiRecommendations(recommendations)
    } catch (error) {
      console.error('Failed to get AI recommendations:', error)
      setAiRecommendations([])
    } finally {
      setIsLoading(false)
    }
  }

  // Initialize with first scenario
  useEffect(() => {
    updateScenario(AI_DEMO_SCENARIOS[0])
  }, [])

  return (
    <div className="max-w-4xl mx-auto min-h-screen bg-gray-50 p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-purple-800 mb-2">🤖 AI Restaurant Recommendations</h1>
        <p className="text-gray-600">See how our AI intelligently selects the perfect restaurants for your event</p>
      </div>

      {/* Scenario Selector */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Choose a Demo Scenario</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {AI_DEMO_SCENARIOS.map((scenario) => (
            <button
              key={scenario.id}
              onClick={() => updateScenario(scenario)}
              className={`p-4 rounded-2xl border-2 transition-all text-left ${
                selectedScenario.id === scenario.id
                  ? 'border-purple-600 bg-purple-50'
                  : 'border-gray-200 hover:border-purple-300 bg-white'
              }`}
            >
              <h3 className="font-semibold text-gray-900 mb-1">{scenario.title}</h3>
              <p className="text-sm text-gray-600 mb-2">{scenario.description}</p>
              <div className="text-xs text-gray-500 space-y-1">
                <div>🎉 {scenario.preferences.eventType}</div>
                <div>👥 {scenario.preferences.guestCount} guests</div>
                <div>💰 ${scenario.preferences.budget === 'budget-2' ? '1,000-3,000' : 
                         scenario.preferences.budget === 'budget-4' ? '5,000+' : '500-1,000'}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Current Scenario Details */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Current Scenario: {selectedScenario.title}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="bg-purple-50 p-3 rounded-lg">
            <div className="font-medium text-purple-800">Event Type</div>
            <div className="text-gray-700">{selectedScenario.preferences.eventType}</div>
          </div>
          <div className="bg-purple-50 p-3 rounded-lg">
            <div className="font-medium text-purple-800">Guest Count</div>
            <div className="text-gray-700">{selectedScenario.preferences.guestCount} guests</div>
          </div>
          <div className="bg-purple-50 p-3 rounded-lg">
            <div className="font-medium text-purple-800">Budget Range</div>
            <div className="text-gray-700">
              ${selectedScenario.preferences.budget === 'budget-2' ? '1,000-3,000' : 
                selectedScenario.preferences.budget === 'budget-4' ? '5,000+' : '500-1,000'}
            </div>
          </div>
          <div className="bg-purple-50 p-3 rounded-lg">
            <div className="font-medium text-purple-800">AI Matches</div>
            <div className="text-gray-700">{isLoading ? 'Analyzing...' : `${aiRecommendations.length} found`}</div>
          </div>
        </div>
        
        {/* Special Requirements */}
        <div className="mt-4">
          <h4 className="font-medium text-gray-900 mb-2">Special Requirements:</h4>
          <div className="flex flex-wrap gap-2">
            {selectedScenario.preferences.specialRequirements?.map((req, index) => (
              <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                {req}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* AI Recommendations */}
      <div>
        <h2 className="text-xl font-semibold mb-4">
          🤖 AI Recommendations ({isLoading ? 'Analyzing...' : aiRecommendations.length} found)
        </h2>
        
        {isLoading ? (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-purple-200 rounded-full animate-pulse"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded animate-pulse w-4/5"></div>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-purple-200 rounded-full animate-pulse"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded animate-pulse w-4/5"></div>
              </div>
            </div>
          </div>
        ) : aiRecommendations.length > 0 ? (
          <div className="grid gap-6">
            {aiRecommendations.map((recommendation) => {
              const restaurant = getRestaurantById(recommendation.restaurantId)
              if (!restaurant) return null
              
              return (
                <AIRestaurantCard
                  key={restaurant.id}
                  restaurant={restaurant}
                  aiRecommendation={recommendation}
                  onSelect={setSelectedRestaurant}
                  isSelected={selectedRestaurant === restaurant.id}
                />
              )
            })}
          </div>
        ) : (
          <div className="bg-yellow-50 p-6 rounded-2xl text-center">
            <div className="text-yellow-800 font-medium mb-2">No AI recommendations found</div>
            <div className="text-yellow-700 text-sm">
              The AI couldn't find a perfect match for your current preferences. 
              Try adjusting your requirements or contact us for personalized assistance.
            </div>
          </div>
        )}
      </div>

      {/* AI Explanation */}
      <div className="mt-8 bg-blue-50 p-6 rounded-2xl">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">🤖 How AI Recommendations Work</h3>
        <p className="text-blue-700 text-sm mb-3">
          Our AI analyzes multiple factors to find the perfect restaurant match:
        </p>
        <ul className="text-blue-700 text-sm space-y-1">
          <li>• <strong>Event Type Compatibility:</strong> Matches restaurants that specialize in your event type</li>
          <li>• <strong>Guest Capacity:</strong> Ensures the restaurant can accommodate your group size</li>
          <li>• <strong>Budget Appropriateness:</strong> Finds options within your price range</li>
          <li>• <strong>Atmosphere & Occasion:</strong> Considers the vibe and special requirements</li>
          <li>• <strong>Package Relevance:</strong> Identifies the best dining packages for your needs</li>
        </ul>
      </div>

      {/* Setup Instructions */}
      <div className="mt-8 bg-purple-50 p-6 rounded-2xl">
        <h3 className="text-lg font-semibold text-purple-800 mb-2">🔧 Setup Instructions</h3>
        <p className="text-purple-700 text-sm mb-3">
          To use the AI recommendation system:
        </p>
        <ol className="text-purple-700 text-sm space-y-1">
          <li>1. Get a Groq API key from <a href="https://console.groq.com/" className="underline">console.groq.com</a></li>
          <li>2. Create a <code className="bg-purple-100 px-1 rounded">.env.local</code> file in your project root</li>
          <li>3. Add <code className="bg-purple-100 px-1 rounded">GROQ_API_KEY=your_api_key_here</code></li>
          <li>4. Restart your development server</li>
        </ol>
      </div>
    </div>
  )
}
