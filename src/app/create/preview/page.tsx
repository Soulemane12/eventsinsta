'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import AIRestaurantCard from '../../../components/AIRestaurantCard'
import AISportsArenaCard from '../../../components/AISportsArenaCard'
import { RESTAURANTS, getRestaurantPriceByGuestCount } from '../../../data/restaurants'
import { SPORTS_ARENAS, getSportsArenaPriceByGuestCount } from '../../../data/sportsArenas'
import { getAIRecommendations } from '../../../services/aiRecommendation'
import { getAISportsArenaRecommendations } from '../../../services/aiSportsArenaRecommendation'
import { VENUE_SERVICES } from '../../../data/services'
import { SERVICES } from '../../../data/services'
import Logo from '../../../components/Logo'

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
  const pct = (step / 6) * 100
  return (
    <div className="sticky top-0 bg-white z-10">
      <div className="flex items-center gap-3 p-4">
        <BackBtn />
        <Logo size="md" />
        <div className="text-2xl font-semibold">{step} of 7: {title}</div>
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

interface EventData {
  eventType: string
  location: string
  date: string
  time: string
  guestCount: number
  budget: string
  venue: string
  services: string[]
  servicesTotal: number
}

interface AIRecommendation {
  restaurantId: string
  confidence: number
  reasoning: string
  bestPackage: string
  whyPerfect: string
}

interface AISportsArenaRecommendation {
  arenaId: string
  confidence: number
  reasoning: string
  bestPackage: string
  whyPerfect: string
}

function getBudgetDisplay(budget: string): string {
  switch (budget) {
    case 'budget-1': return '$500 - $1,000'
    case 'budget-2': return '$1,000 - $3,000'
    case 'budget-3': return '$3,000 - $5,000'
    case 'budget-4': return '$5,000+'
    default: return '$1,000 - $3,000'
  }
}

function getBudgetRange(budget: string): { min: number; max: number } {
  switch (budget) {
    case 'budget-1': return { min: 500, max: 1000 }
    case 'budget-2': return { min: 1000, max: 3000 }
    case 'budget-3': return { min: 3000, max: 5000 }
    case 'budget-4': return { min: 5000, max: 50000 }
    default: return { min: 1000, max: 3000 }
  }
}

function getVenueDisplayName(venueId: string): string {
  if (!venueId) return 'No venue selected'
  const venue = VENUE_SERVICES.find(v => v.id === venueId)
  return venue ? venue.name : venueId.replace('venue-', '').replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())
}

function getVenueDescription(venueId: string): string {
  if (!venueId) return 'Please select a venue for your event'
  const venue = VENUE_SERVICES.find(v => v.id === venueId)
  return venue ? venue.description : 'Selected venue for your event'
}

function getVenueCost(venueId: string, guestCount: number): number {
  if (!venueId) return 0
  const venue = VENUE_SERVICES.find(v => v.id === venueId)
  if (!venue) return 0
  
  // For restaurant venues, use the restaurant pricing
  if (venueId === 'venue-restaurant') {
    return 0 // Will be handled separately with selectedRestaurant
  }
  
  // For other venues, return the base price
  return venue.price || 0
}

function formatDate(dateString: string): string {
  if (!dateString) return 'Not set'
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    })
  } catch {
    return dateString
  }
}

function formatTime(timeString: string): string {
  if (!timeString) return 'Not set'
  // If it already contains AM/PM or looks like a time range, return as is
  if (timeString.includes('AM') || timeString.includes('PM') || timeString.includes(' - ')) {
    return timeString
  }
  try {
    const [hours, minutes] = timeString.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  } catch {
    return timeString
  }
}

function PreviewContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [aiRecommendations, setAiRecommendations] = useState<AIRecommendation[]>([])
  const [aiSportsArenaRecommendations, setAiSportsArenaRecommendations] = useState<AISportsArenaRecommendation[]>([])
  const [selectedRestaurant, setSelectedRestaurant] = useState<string>('')
  const [selectedSportsArena, setSelectedSportsArena] = useState<string>('')
  const [selectedRestaurantPackages, setSelectedRestaurantPackages] = useState<{[key: string]: string}>({})
  const [selectedSportsArenaPackages, setSelectedSportsArenaPackages] = useState<{[key: string]: string}>({})
  const [loading, setLoading] = useState(true)
  const [eventData, setEventData] = useState<EventData | null>(null)

  useEffect(() => {
    // Get event data from URL parameters
    const eventType = searchParams.get('eventType') || 'Anniversary'
    const location = searchParams.get('location') || 'New York, NY'
    const date = searchParams.get('date') || ''
    const time = searchParams.get('time') || ''
    const startTime = searchParams.get('startTime') || ''
    const endTime = searchParams.get('endTime') || ''
    const guestCount = parseInt(searchParams.get('guestCount') || '2')
    const budget = searchParams.get('budget') || 'budget-2'
    const venue = searchParams.get('venue') || ''
    const services = searchParams.get('services')?.split(',').filter(Boolean) || []
    const servicesTotal = parseInt(searchParams.get('servicesTotal') || '0')



    // Combine start and end time if they exist, otherwise use the time parameter
    const combinedTime = (startTime && endTime) ? `${startTime} - ${endTime}` : time

    const data: EventData = {
      eventType,
      location,
      date,
      time: combinedTime,
      guestCount,
      budget,
      venue,
      services,
      servicesTotal
    }

    setEventData(data)
    
    // Clear restaurant and sports arena selections when venue changes
    if (venue !== 'venue-restaurant') {
      setSelectedRestaurant('')
      setSelectedRestaurantPackages({})
    }
    if (venue !== 'venue-sports-arena') {
      setSelectedSportsArena('')
      setSelectedSportsArenaPackages({})
    }
  }, [searchParams])

  useEffect(() => {
    if (!eventData) return

    async function loadRecommendations() {
      setLoading(true)
      try {
        // Load restaurant recommendations
        if (eventData!.venue === 'venue-restaurant') {
          const recommendations = await getAIRecommendations({
            eventType: eventData!.eventType,
            guestCount: eventData!.guestCount,
            budget: eventData!.budget,
            location: eventData!.location
          })
          setAiRecommendations(recommendations || [])
        } else {
          setAiRecommendations([])
        }

        // Load sports arena recommendations
        if (eventData!.venue === 'venue-sports-arena') {
          const sportsArenaRecommendations = await getAISportsArenaRecommendations({
            eventType: eventData!.eventType,
            guestCount: eventData!.guestCount,
            budget: eventData!.budget,
            location: eventData!.location
          })
          setAiSportsArenaRecommendations(sportsArenaRecommendations || [])
        } else {
          setAiSportsArenaRecommendations([])
        }
      } catch (error) {
        console.error('Failed to load AI recommendations:', error)
        setAiRecommendations([])
        setAiSportsArenaRecommendations([])
      } finally {
        setLoading(false)
      }
    }

    loadRecommendations()
  }, [eventData])

  const getRecommendationForRestaurant = (restaurantId: string) => {
    if (!aiRecommendations || aiRecommendations.length === 0) return undefined
    return aiRecommendations.find(rec => rec.restaurantId === restaurantId)
  }

  const getRecommendationForSportsArena = (arenaId: string) => {
    if (!aiSportsArenaRecommendations || aiSportsArenaRecommendations.length === 0) return undefined
    return aiSportsArenaRecommendations.find(rec => rec.arenaId === arenaId)
  }

  const recommendedRestaurants = RESTAURANTS.filter(restaurant => {
    if (!aiRecommendations || aiRecommendations.length === 0) return false
    return aiRecommendations.some(rec => rec.restaurantId === restaurant.id)
  })

  const recommendedSportsArenas = SPORTS_ARENAS.filter(arena => {
    if (!aiSportsArenaRecommendations || aiSportsArenaRecommendations.length === 0) return false
    return aiSportsArenaRecommendations.some(rec => rec.arenaId === arena.id)
  })

  // Package selection handlers
  const handleRestaurantPackageSelect = (restaurantId: string, packageName: string) => {
    console.log('handleRestaurantPackageSelect called:', restaurantId, packageName)
    // Select the restaurant and package
    setSelectedRestaurant(restaurantId)
    setSelectedRestaurantPackages(prev => {
      const newState = {
        ...prev,
        [restaurantId]: packageName
      }
      console.log('New restaurant packages state:', newState)
      return newState
    })
  }

  const handleSportsArenaPackageSelect = (arenaId: string, packageName: string) => {
    console.log('handleSportsArenaPackageSelect called:', arenaId, packageName)
    // Select the arena and package
    setSelectedSportsArena(arenaId)
    setSelectedSportsArenaPackages(prev => {
      const newState = {
        ...prev,
        [arenaId]: packageName
      }
      console.log('New arena packages state:', newState)
      return newState
    })
  }

  // Clear package selection when restaurant/arena changes
  const handleRestaurantSelect = (restaurantId: string) => {
    setSelectedRestaurant(restaurantId)
    // Don't clear package selection - let users keep their package choice
  }

  const handleSportsArenaSelect = (arenaId: string) => {
    setSelectedSportsArena(arenaId)
    // Don't clear package selection - let users keep their package choice
  }

  const getTotalCost = () => {
    if (!eventData) return 0

    let venueCost = 0
    if (selectedRestaurant) {
      const selectedPackage = selectedRestaurantPackages[selectedRestaurant]
      if (selectedPackage) {
        // Use selected package price
        const restaurant = RESTAURANTS.find(r => r.id === selectedRestaurant)
        const selectedPkg = restaurant?.packages.find(p => p.name === selectedPackage)
        venueCost = selectedPkg?.price || 0
      } else {
        // Use default pricing logic
        venueCost = getRestaurantPriceByGuestCount(selectedRestaurant, eventData.guestCount)
      }
    } else if (selectedSportsArena) {
      const selectedPackage = selectedSportsArenaPackages[selectedSportsArena]
      console.log('getTotalCost - Sports Arena:', {
        selectedSportsArena,
        selectedPackage,
        selectedSportsArenaPackages
      })
      if (selectedPackage) {
        // Use selected package price
        const arena = SPORTS_ARENAS.find(a => a.id === selectedSportsArena)
        const selectedPkg = arena?.packages.find(p => p.name === selectedPackage)
        if (selectedPkg?.price) {
          venueCost = selectedPkg.price
        } else {
          // Fallback: try partial name matching
          const fallbackPkg = arena?.packages.find(p =>
            p.name.toLowerCase().includes(selectedPackage.toLowerCase()) ||
            selectedPackage.toLowerCase().includes(p.name.toLowerCase())
          )
          venueCost = fallbackPkg?.price || 0
          console.log('getTotalCost - Fallback package:', { fallbackPkg: fallbackPkg?.name, price: fallbackPkg?.price })
        }
        console.log('getTotalCost - Package price:', { arena: arena?.name, pkg: selectedPkg?.name, price: selectedPkg?.price, venueCost })
      } else {
        // Use default pricing logic
        venueCost = getSportsArenaPriceByGuestCount(selectedSportsArena, eventData.guestCount)
        console.log('getTotalCost - Default price:', venueCost)
      }
    } else if (eventData.venue && eventData.venue !== 'venue-restaurant' && eventData.venue !== 'venue-sports-arena') {
      venueCost = getVenueCost(eventData.venue, eventData.guestCount)
    }

    return venueCost + eventData.servicesTotal
  }

  const getBudgetRange = (budget: string) => {
    switch (budget) {
      case 'budget-1': return { min: 500, max: 1000 }
      case 'budget-2': return { min: 1000, max: 3000 }
      case 'budget-3': return { min: 3000, max: 5000 }
      case 'budget-4': return { min: 5000, max: 50000 }
      default: return { min: 1000, max: 3000 }
    }
  }

  const isWithinBudget = () => {
    if (!eventData || (!selectedRestaurant && !selectedSportsArena && eventData.venue === 'venue-restaurant')) return true
    const totalCost = getTotalCost()
    const budgetRange = getBudgetRange(eventData.budget)
    return totalCost >= budgetRange.min && totalCost <= budgetRange.max
  }

  if (!eventData) {
    return (
      <div className="max-w-md mx-auto min-h-screen bg-gray-50">
        <StepHeader step={6} title="Review Your Event" />
        <div className="p-6">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-sm text-gray-600">Loading event details...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto min-h-screen bg-gray-50">
      <StepHeader step={6} title="Review Your Event" />
      <div className="p-6 space-y-6">
        <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">
              {eventData.venue === 'venue-restaurant' ? '🍽️ Choose Your Restaurant' : 
               eventData.venue === 'venue-sports-arena' ? '🏟️ Choose Your Sports Arena' :
               (eventData.venue && eventData.venue !== '') ? '🏛️ Venue & Services Summary' : '🍽️ Perfect Restaurant Matches'}
            </h2>
            <p className="text-sm text-gray-600">
              {eventData.venue === 'venue-restaurant' 
                ? 'Select from our curated list of restaurant venues for your event'
                : eventData.venue === 'venue-sports-arena'
                  ? 'Select from our curated list of sports arena venues for your event'
                : (eventData.venue && eventData.venue !== '') 
                  ? `Your event will be held at your selected venue with the services you've chosen`
                  : 'We\'ve found the best restaurants for your event'
              }
            </p>
          </div>

        {/* Event Summary */}
        <Card className="p-4">
          <div className="text-sm font-medium text-purple-800 mb-2">Your Event Details</div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>🎉 {eventData.eventType}</div>
            <div>📍 {eventData.location}</div>
            <div>📅 {formatDate(eventData.date)}</div>
            <div>👥 {eventData.guestCount} guests</div>
            <div>💰 {getBudgetDisplay(eventData.budget)}</div>
            <div>🕐 {formatTime(eventData.time)}</div>
            {eventData.venue && <div>🏛️ {getVenueDisplayName(eventData.venue)}</div>}
          </div>
        </Card>

        {/* Venue Information */}
        {eventData.venue && eventData.venue !== 'venue-restaurant' && eventData.venue !== 'venue-sports-arena' && (
          <Card className="p-4">
            <div className="text-sm font-medium text-purple-800 mb-2">🏛️ Selected Venue</div>
            <div className="bg-purple-50 p-3 rounded-lg">
              <div className="text-sm font-semibold text-purple-800 mb-1">
                {getVenueDisplayName(eventData.venue)}
              </div>
              <div className="text-xs text-purple-700">
                {getVenueDescription(eventData.venue)}
              </div>
              <div className="text-xs text-purple-600 mt-2">
                ✅ Venue is confirmed for your event
              </div>
            </div>
          </Card>
        )}

        {/* Restaurant Venue Selection Info */}
        {eventData.venue === 'venue-restaurant' && (
          <Card className="p-4">
            <div className="text-sm font-medium text-purple-800 mb-2">🍽️ Restaurant Venue Selected</div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="text-sm font-semibold text-blue-800 mb-1">
                Restaurant Venue
              </div>
              <div className="text-xs text-blue-700">
                You've chosen to host your event at a restaurant venue. Below you'll find our recommended restaurants that are perfect for your event type, guest count, and budget.
              </div>
              <div className="text-xs text-blue-600 mt-2">
                💡 Select a restaurant below to proceed with your booking
              </div>
            </div>
          </Card>
        )}

        {/* Sports Arena Venue Selection Info */}
        {eventData.venue === 'venue-sports-arena' && (
          <Card className="p-4">
            <div className="text-sm font-medium text-purple-800 mb-2">🏟️ Sports Arena Venue Selected</div>
            <div className="bg-green-50 p-3 rounded-lg">
              <div className="text-sm font-semibold text-green-800 mb-1">
                Sports Arena Venue
              </div>
              <div className="text-xs text-green-700">
                You've chosen to host your event at a sports arena venue. Below you'll find our recommended sports arenas that are perfect for your event type, guest count, and budget.
              </div>
              <div className="text-xs text-green-600 mt-2">
                💡 Select a sports arena below to proceed with your booking
              </div>
            </div>
          </Card>
        )}

        {/* Services Summary */}
        {eventData.services.length > 0 && (
          <Card className="p-4">
            <div className="text-sm font-medium text-purple-800 mb-2">Selected Services</div>
            <div className="space-y-2">
              {eventData.services.map(serviceId => {
                const service = SERVICES.find(s => s.id === serviceId)
                return service ? (
                  <div key={serviceId} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span>{service.icon}</span>
                      <span className="text-gray-700">{service.name}</span>
                    </div>
                    <span className="font-semibold text-purple-600">${service.price}</span>
                  </div>
                ) : null
              })}
              <div className="border-t border-gray-200 pt-2 mt-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-purple-800">Total Services Cost</span>
                  <span className="text-purple-800">${eventData.servicesTotal}</span>
                </div>
              </div>
                </div>
              </Card>
        )}

        {/* Loading State - Only for Restaurant and Sports Arena Venues */}
        {(eventData.venue === 'venue-restaurant' || eventData.venue === 'venue-sports-arena') && loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-sm text-gray-600">
              {eventData.venue === 'venue-restaurant' 
                ? 'Finding perfect restaurants for your event...' 
                : 'Finding perfect sports arenas for your event...'}
            </p>
          </div>
        )}

        {/* AI Recommendations - Only for Restaurant Venues */}
        {eventData.venue === 'venue-restaurant' && !loading && recommendedRestaurants.length > 0 && (
        <div>
            <h3 className="text-lg font-semibold mb-3">🍽️ Recommended Restaurants</h3>
            <div className="space-y-4">
              {recommendedRestaurants.map((restaurant) => (
                <AIRestaurantCard
                  key={restaurant.id}
                  restaurant={restaurant}
                  aiRecommendation={getRecommendationForRestaurant(restaurant.id)}
                  onSelect={handleRestaurantSelect}
                  isSelected={selectedRestaurant === restaurant.id}
                  showDetails={true}
                  guestCount={eventData.guestCount}
                  selectedPackage={selectedRestaurantPackages[restaurant.id]}
                  onPackageSelect={handleRestaurantPackageSelect}
                />
              ))}
                    </div>
                  </div>
        )}

        {/* AI Recommendations - Only for Sports Arena Venues */}
        {eventData.venue === 'venue-sports-arena' && !loading && recommendedSportsArenas.length > 0 && (
        <div>
            <h3 className="text-lg font-semibold mb-3">🏟️ Recommended Sports Arenas</h3>
            <div className="space-y-4">
              {recommendedSportsArenas.map((arena) => (
                <AISportsArenaCard
                  key={arena.id}
                  arena={arena}
                  aiRecommendation={getRecommendationForSportsArena(arena.id)}
                  onSelect={handleSportsArenaSelect}
                  isSelected={selectedSportsArena === arena.id}
                  showDetails={true}
                  guestCount={eventData.guestCount}
                  selectedPackage={selectedSportsArenaPackages[arena.id]}
                  onPackageSelect={handleSportsArenaPackageSelect}
                />
              ))}
                    </div>
                  </div>
        )}

        {/* No Recommendations - Only for Restaurant Venues */}
        {eventData.venue === 'venue-restaurant' && !loading && recommendedRestaurants.length === 0 && (
          <div className="bg-yellow-50 p-6 rounded-2xl text-center">
            <div className="text-yellow-800 font-medium mb-2">🤖 AI Analysis: No Perfect Matches Found</div>
            <div className="text-yellow-700 text-sm mb-4">
              <div className="mb-4">
                <strong>Your Event Details:</strong><br />
                • Event Type: {eventData.eventType}<br />
                • Guest Count: {eventData.guestCount} guests<br />
                • Budget: {getBudgetDisplay(eventData.budget)}<br />
                • Location: {eventData.location}
              </div>
              
              <div className="bg-white p-4 rounded-lg text-left">
                <div className="font-semibold text-yellow-800 mb-2">🤖 AI Reasoning:</div>
                {aiRecommendations.length === 0 ? (
                  <div className="space-y-2 text-sm">
                    <div className="text-gray-700">
                      <strong>Why no matches were found:</strong>
                    </div>
                    <ul className="space-y-1 ml-4">
                      {eventData.guestCount > 200 && (
                        <li>• <span className="text-red-600">Guest count ({eventData.guestCount}) exceeds maximum restaurant capacity (200)</span></li>
                      )}
                      {eventData.guestCount < 2 && (
                        <li>• <span className="text-red-600">Guest count ({eventData.guestCount}) is too low for group events</span></li>
                      )}
                      {eventData.budget === 'budget-1' && eventData.guestCount > 20 && (
                        <li>• <span className="text-red-600">Budget too low for {eventData.guestCount} guests - need higher budget tier</span></li>
                      )}
                      {eventData.eventType.toLowerCase().includes('corporate') && eventData.budget === 'budget-1' && (
                        <li>• <span className="text-red-600">Corporate events require higher budget tier for professional service</span></li>
                      )}
                      {eventData.eventType.toLowerCase().includes('wedding') && eventData.guestCount > 50 && (
                        <li>• <span className="text-red-600">Large wedding events need premium venues with higher capacity</span></li>
                      )}
                      <li>• <span className="text-orange-600">Location preferences may not match available restaurant locations</span></li>
                      <li>• <span className="text-orange-600">Specific event type requirements not met by current partners</span></li>
                    </ul>
                  </div>
                ) : (
                  <div className="text-sm text-gray-700">
                    <div className="mb-2">
                      <strong>AI found {aiRecommendations.length} potential matches, but they don't meet your specific criteria:</strong>
                    </div>
                    {aiRecommendations.map((rec, index) => (
                      <div key={index} className="mb-2 p-2 bg-gray-50 rounded">
                        <div className="font-medium">{rec.restaurantId.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</div>
                        <div className="text-xs text-gray-600">Confidence: {Math.round(rec.confidence * 100)}%</div>
                        <div className="text-xs text-gray-600">{rec.reasoning}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="mt-4 text-sm">
                <strong>💡 Suggestions:</strong>
                <ul className="mt-2 text-left max-w-md mx-auto space-y-1">
                  <li>• Adjust guest count to fit restaurant capacities</li>
                  <li>• Increase budget for premium venues</li>
                  <li>• Try a different event type</li>
                  <li>• Consider different location options</li>
                </ul>
              </div>
            </div>
            
            <div className="space-y-2">
              <button
                onClick={() => router.push('/create/guests')}
                className="w-full px-4 py-2 bg-yellow-600 text-white rounded-lg text-sm font-medium hover:bg-yellow-700"
              >
                Adjust Event Details
              </button>
              <button
                onClick={() => router.push('/create/customize')}
                className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg text-sm font-medium hover:bg-gray-700"
              >
                Try Different Event Type
              </button>
            </div>
          </div>
        )}

        {/* No Recommendations - Only for Sports Arena Venues */}
        {eventData.venue === 'venue-sports-arena' && !loading && recommendedSportsArenas.length === 0 && (
          <div className="bg-yellow-50 p-6 rounded-2xl text-center">
            <div className="text-yellow-800 font-medium mb-2">🤖 AI Analysis: No Perfect Matches Found</div>
            <div className="text-yellow-700 text-sm mb-4">
              <div className="mb-4">
                <strong>Your Event Details:</strong><br />
                • Event Type: {eventData.eventType}<br />
                • Guest Count: {eventData.guestCount} guests<br />
                • Budget: {getBudgetDisplay(eventData.budget)}<br />
                • Location: {eventData.location}
              </div>
              
              <div className="bg-white p-4 rounded-lg text-left">
                <div className="font-semibold text-yellow-800 mb-2">🤖 AI Reasoning:</div>
                {aiSportsArenaRecommendations.length === 0 ? (
                  <div className="space-y-2 text-sm">
                    <div className="text-gray-700">
                      <strong>Why no matches were found:</strong>
                    </div>
                    <ul className="space-y-1 ml-4">
                      {eventData.guestCount > 200 && (
                        <li>• <span className="text-red-600">Guest count ({eventData.guestCount}) exceeds maximum sports arena capacity (200)</span></li>
                      )}
                      {eventData.guestCount < 20 && (
                        <li>• <span className="text-red-600">Guest count ({eventData.guestCount}) is too low for sports arena events (minimum 20)</span></li>
                      )}
                      {eventData.budget === 'budget-1' && eventData.guestCount > 20 && (
                        <li>• <span className="text-red-600">Budget too low for {eventData.guestCount} guests - need higher budget tier</span></li>
                      )}
                      {eventData.eventType.toLowerCase().includes('corporate') && eventData.budget === 'budget-1' && (
                        <li>• <span className="text-red-600">Corporate events require higher budget tier for premium sports arena service</span></li>
                      )}
                      <li>• <span className="text-orange-600">Location preferences may not match available sports arena locations</span></li>
                      <li>• <span className="text-orange-600">Specific event type requirements not met by current sports arena partners</span></li>
                    </ul>
                  </div>
                ) : (
                  <div className="text-sm text-gray-700">
                    <div className="mb-2">
                      <strong>AI found {aiSportsArenaRecommendations.length} potential matches, but they don't meet your specific criteria:</strong>
                    </div>
                    {aiSportsArenaRecommendations.map((rec, index) => (
                      <div key={index} className="mb-2 p-2 bg-gray-50 rounded">
                        <div className="font-medium">{rec.arenaId.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</div>
                        <div className="text-xs text-gray-600">Confidence: {Math.round(rec.confidence * 100)}%</div>
                        <div className="text-xs text-gray-600">{rec.reasoning}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="mt-4 text-sm">
                <strong>💡 Suggestions:</strong>
                <ul className="mt-2 text-left max-w-md mx-auto space-y-1">
                  <li>• Adjust guest count to fit sports arena capacities (20-200 guests)</li>
                  <li>• Increase budget for premium sports arena venues</li>
                  <li>• Try a different event type</li>
                  <li>• Consider different location options</li>
                </ul>
              </div>
            </div>
            
            <div className="space-y-2">
              <button
                onClick={() => router.push('/create/guests')}
                className="w-full px-4 py-2 bg-yellow-600 text-white rounded-lg text-sm font-medium hover:bg-yellow-700"
              >
                Adjust Event Details
              </button>
              <button
                onClick={() => router.push('/create/customize')}
                className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg text-sm font-medium hover:bg-gray-700"
              >
                Try Different Event Type
              </button>
            </div>
          </div>
        )}

        {/* Cost Summary */}
        {(selectedRestaurant || selectedSportsArena || (eventData.venue && eventData.venue !== 'venue-restaurant' && eventData.venue !== 'venue-sports-arena')) && (
          <Card className="p-4">
            <div className="text-sm font-medium text-purple-800 mb-2">💰 Cost Summary</div>
            <div className="space-y-2 text-xs">
              {selectedRestaurant && (
                <div>
                  <div className="flex justify-between">
                    <span>🍽️ {RESTAURANTS.find(r => r.id === selectedRestaurant)?.name}:</span>
                    <span className="font-semibold">${(() => {
                      const selectedPackage = selectedRestaurantPackages[selectedRestaurant]
                      if (selectedPackage) {
                        const restaurant = RESTAURANTS.find(r => r.id === selectedRestaurant)
                        const pkg = restaurant?.packages.find(p => p.name === selectedPackage)
                        return pkg?.price || 0
                      }
                      return getRestaurantPriceByGuestCount(selectedRestaurant, eventData.guestCount)
                    })()}</span>
                  </div>
                  {selectedRestaurantPackages[selectedRestaurant] && (
                    <div className="text-xs text-purple-600 ml-2">
                      📦 Package: {selectedRestaurantPackages[selectedRestaurant]}
                    </div>
                  )}
                </div>
              )}
              {selectedSportsArena && (
                <div>
                  <div className="flex justify-between">
                    <span>🏟️ {SPORTS_ARENAS.find(a => a.id === selectedSportsArena)?.name}:</span>
                    <span className="font-semibold">${(() => {
                      const selectedPackage = selectedSportsArenaPackages[selectedSportsArena]
                      console.log('Sports Arena Cost Calculation:', {
                        selectedSportsArena,
                        selectedPackage,
                        selectedSportsArenaPackages
                      })
                      if (selectedPackage) {
                        const arena = SPORTS_ARENAS.find(a => a.id === selectedSportsArena)
                        const pkg = arena?.packages.find(p => p.name === selectedPackage)
                        console.log('Found arena and package:', { arena: arena?.name, pkg: pkg?.name, price: pkg?.price })
                        if (pkg?.price) {
                          return pkg.price
                        }
                        // Fallback: if exact match fails, try to find package by partial name match
                        const fallbackPkg = arena?.packages.find(p =>
                          p.name.toLowerCase().includes(selectedPackage.toLowerCase()) ||
                          selectedPackage.toLowerCase().includes(p.name.toLowerCase())
                        )
                        console.log('Fallback package search:', { fallbackPkg: fallbackPkg?.name, price: fallbackPkg?.price })
                        return fallbackPkg?.price || 0
                      }
                      const defaultPrice = getSportsArenaPriceByGuestCount(selectedSportsArena, eventData.guestCount)
                      console.log('Using default price:', defaultPrice)
                      return defaultPrice
                    })()}</span>
                  </div>
                  {selectedSportsArenaPackages[selectedSportsArena] && (
                    <div className="text-xs text-purple-600 ml-2">
                      📦 Package: {selectedSportsArenaPackages[selectedSportsArena]}
                    </div>
                  )}
                </div>
              )}
              {eventData.venue && eventData.venue !== 'venue-restaurant' && eventData.venue !== 'venue-sports-arena' && (
                <div className="flex justify-between">
                  <span>Venue Cost:</span>
                  <span className="font-semibold">${getVenueCost(eventData.venue, eventData.guestCount)}</span>
                </div>
              )}
              {eventData.servicesTotal > 0 && (
                <div className="flex justify-between">
                  <span>Services Cost:</span>
                  <span className="font-semibold">${eventData.servicesTotal}</span>
                </div>
              )}
              <div className="border-t border-gray-200 pt-2 mt-2">
                <div className="flex justify-between font-bold">
                  <span>Total Cost:</span>
                  <span className="text-purple-600">
                    ${getTotalCost()}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Success Message */}
        {(selectedRestaurant || selectedSportsArena || (eventData.venue && eventData.venue !== 'venue-restaurant' && eventData.venue !== 'venue-sports-arena')) && (
        <div className="bg-green-50 p-4 rounded-xl">
            <div className="text-sm font-medium text-green-800 mb-2">
              {selectedRestaurant ? '✅ Restaurant Selected!' : selectedSportsArena ? '✅ Sports Arena Selected!' : '✅ Venue Confirmed!'}
            </div>
          <div className="text-xs text-green-700">
              {selectedRestaurant
                ? (
                  <div>
                    <div className="mb-2">Great choice! <strong>{RESTAURANTS.find(r => r.id === selectedRestaurant)?.name}</strong> is perfect for your {eventData.eventType.toLowerCase()} celebration.</div>
                    {selectedRestaurantPackages[selectedRestaurant] && (
                      <div className="bg-white p-2 rounded border border-green-200">
                        <div className="text-green-800 font-medium">📦 Selected Package:</div>
                        <div className="text-green-700">{selectedRestaurantPackages[selectedRestaurant]}</div>
                        <div className="text-green-600 font-semibold">
                          ${(() => {
                            const restaurant = RESTAURANTS.find(r => r.id === selectedRestaurant)
                            const pkg = restaurant?.packages.find(p => p.name === selectedRestaurantPackages[selectedRestaurant])
                            return pkg?.price || 0
                          })()}
                        </div>
                      </div>
                    )}
                  </div>
                )
                : selectedSportsArena
                  ? (
                    <div>
                      <div className="mb-2">Excellent choice! <strong>{SPORTS_ARENAS.find(a => a.id === selectedSportsArena)?.name}</strong> is perfect for your {eventData.eventType.toLowerCase()} event. 🏀</div>
                      {selectedSportsArenaPackages[selectedSportsArena] && (
                        <div className="bg-white p-2 rounded border border-green-200">
                          <div className="text-green-800 font-medium">📦 Selected Package:</div>
                          <div className="text-green-700">{selectedSportsArenaPackages[selectedSportsArena]}</div>
                          <div className="text-green-600 font-semibold">
                            ${(() => {
                              const arena = SPORTS_ARENAS.find(a => a.id === selectedSportsArena)
                              const pkg = arena?.packages.find(p => p.name === selectedSportsArenaPackages[selectedSportsArena])
                              console.log('Success message pricing:', {
                                selectedSportsArena,
                                packageName: selectedSportsArenaPackages[selectedSportsArena],
                                arena: arena?.name,
                                pkg: pkg?.name,
                                price: pkg?.price
                              })
                              if (pkg?.price) {
                                return pkg.price
                              }
                              // Fallback matching
                              const fallbackPkg = arena?.packages.find(p =>
                                p.name.toLowerCase().includes(selectedSportsArenaPackages[selectedSportsArena]?.toLowerCase() || '') ||
                                (selectedSportsArenaPackages[selectedSportsArena]?.toLowerCase() || '').includes(p.name.toLowerCase())
                              )
                              console.log('Success message fallback:', { fallbackPkg: fallbackPkg?.name, price: fallbackPkg?.price })
                              return fallbackPkg?.price || 0
                            })()}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                  : eventData.venue === 'venue-sports-arena' || eventData.venue === 'venue-madison-square-garden'
                    ? `Perfect! Your ${eventData.venue.replace('venue-', '').replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} venue is confirmed for your event. 🏀 Perfect for sporting events like NY Knicks games, boxing matches, or basketball tournaments!`
                    : `Perfect! Your ${eventData.venue.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} venue is confirmed for your event.`
              }
            </div>
          </div>
        )}

                  <Button
            onClick={() => {
              const params = new URLSearchParams({
                eventType: eventData.eventType,
                location: eventData.location,
                date: eventData.date,
                time: eventData.time,
                guestCount: eventData.guestCount.toString(),
                budget: eventData.budget,
                venue: eventData.venue,
                services: eventData.services.join(','),
                servicesTotal: eventData.servicesTotal.toString(),
                selectedRestaurant: selectedRestaurant,
                selectedSportsArena: selectedSportsArena
              })
              router.push(`/create/review?${params.toString()}`)
            }}
            disabled={!selectedRestaurant && !selectedSportsArena && (eventData.venue === 'venue-restaurant' || eventData.venue === 'venue-sports-arena')}
          >
            Next: Book & Celebrate!
          </Button>
      </div>
    </div>
  )
}

export default function Preview() {
  return (
    <Suspense fallback={
      <div className="max-w-md mx-auto min-h-screen bg-gray-50">
        <div className="p-6">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-sm text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    }>
      <PreviewContent />
    </Suspense>
  )
}
