'use client'

import { useState, useEffect } from 'react'
import RestaurantCard from '../../components/RestaurantCard'
import CelebrationIdeas from '../../components/CelebrationIdeas'
import { getMatchingRestaurants, Restaurant } from '../../data/restaurants'

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

const DEMO_SCENARIOS = [
  {
    id: 'anniversary-2-guests',
    title: 'Anniversary Dinner for 2',
    description: 'Romantic anniversary celebration for a couple',
    eventType: 'Anniversary',
    guestCount: 2,
    budget: 'budget-2', // $1,000 - $3,000
    expectedMatches: ['saint-restaurant', 'del-friscos']
  },
  {
    id: 'holiday-party-50',
    title: 'Holiday Party for 50',
    description: 'Large holiday celebration with open bar',
    eventType: 'Holiday Party',
    guestCount: 50,
    budget: 'budget-4', // $5,000+
    expectedMatches: ['saint-restaurant']
  },
  {
    id: 'birthday-group',
    title: 'Birthday Party for 20',
    description: 'Birthday celebration with friends',
    eventType: 'Birthday',
    guestCount: 20,
    budget: 'budget-2', // $1,000 - $3,000
    expectedMatches: ['rebel-restaurant', 'saint-restaurant']
  }
]

export default function Demo() {
  const [selectedScenario, setSelectedScenario] = useState(DEMO_SCENARIOS[0])
  const [matchingRestaurants, setMatchingRestaurants] = useState<Restaurant[]>([])
  const [selectedRestaurant, setSelectedRestaurant] = useState<string>('')
  const [showCelebrationIdeas, setShowCelebrationIdeas] = useState(false)

  const updateScenario = (scenario: typeof DEMO_SCENARIOS[0]) => {
    setSelectedScenario(scenario)
    const restaurants = getMatchingRestaurants(
      scenario.eventType,
      scenario.guestCount,
      scenario.budget
    )
    setMatchingRestaurants(restaurants)
    setSelectedRestaurant('')
  }

  const handleCelebrationIdeaSelect = (idea: any) => {
    console.log('Selected celebration idea:', idea)
    setShowCelebrationIdeas(false)
  }

  // Initialize with first scenario
  useEffect(() => {
    updateScenario(DEMO_SCENARIOS[0])
  }, [])

  return (
    <div className="max-w-4xl mx-auto min-h-screen bg-gray-50 p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-purple-800 mb-2">Restaurant Matching Demo</h1>
        <p className="text-gray-600">See how our smart matching system finds the perfect restaurants for your event</p>
      </div>

      {/* Scenario Selector */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Choose a Demo Scenario</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {DEMO_SCENARIOS.map((scenario) => (
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
                <div>🎉 {scenario.eventType}</div>
                <div>👥 {scenario.guestCount} guests</div>
                <div>💰 ${scenario.budget === 'budget-2' ? '1,000-3,000' : 
                         scenario.budget === 'budget-4' ? '5,000+' : '500-1,000'}</div>
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
            <div className="font-medium text-purple-800">Matches Found</div>
            <div className="text-gray-700">{matchingRestaurants.length} restaurants</div>
          </div>
        </div>
      </div>

      {/* Celebration Ideas */}
      <div className="mb-8">
        <div className="text-center mb-4">
          <button
            onClick={() => setShowCelebrationIdeas(!showCelebrationIdeas)}
            className="px-6 py-3 bg-purple-100 text-purple-700 rounded-lg font-medium hover:bg-purple-200 transition-colors"
          >
            {showCelebrationIdeas ? 'Hide' : 'Show'} Celebration Ideas 💡
          </button>
        </div>
        
        {showCelebrationIdeas && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <CelebrationIdeas 
              onSelectIdea={handleCelebrationIdeaSelect}
              selectedEventType={selectedScenario.eventType}
            />
          </div>
        )}
      </div>

      {/* Matching Restaurants */}
      <div>
        <h2 className="text-xl font-semibold mb-4">
          🍽️ Matching Restaurants ({matchingRestaurants.length} found)
        </h2>
        
        {matchingRestaurants.length === 0 ? (
          <div className="bg-yellow-50 p-6 rounded-2xl text-center">
            <div className="text-yellow-800 font-medium mb-2">No matches found</div>
            <div className="text-yellow-700 text-sm">
              Try adjusting your guest count or budget range to find matching restaurants.
            </div>
          </div>
        ) : (
          <div className="grid gap-6">
            {matchingRestaurants.map((restaurant) => (
              <RestaurantCard
                key={restaurant.id}
                restaurant={restaurant}
                onSelect={setSelectedRestaurant}
                isSelected={selectedRestaurant === restaurant.id}
              />
            ))}
          </div>
        )}
      </div>

      {/* Expected Matches Info */}
      <div className="mt-8 bg-blue-50 p-6 rounded-2xl">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">Expected Matches</h3>
        <p className="text-blue-700 text-sm mb-3">
          Based on the current scenario, we expect to find restaurants that support:
        </p>
        <ul className="text-blue-700 text-sm space-y-1">
          <li>• Event type: {selectedScenario.eventType}</li>
          <li>• Guest capacity: {selectedScenario.guestCount} people</li>
          <li>• Budget range: ${selectedScenario.budget === 'budget-2' ? '1,000-3,000' : 
                               selectedScenario.budget === 'budget-4' ? '5,000+' : '500-1,000'}</li>
        </ul>
      </div>
    </div>
  )
}
