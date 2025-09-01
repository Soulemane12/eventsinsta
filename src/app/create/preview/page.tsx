'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import AIRestaurantCard from '../../../components/AIRestaurantCard'
import { RESTAURANTS, getRestaurantPriceByGuestCount } from '../../../data/restaurants'
import { getAIRecommendations } from '../../../services/aiRecommendation'
import { SERVICES } from '../../../data/services'

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
      <div className="flex items-center gap-2 p-4">
        <BackBtn />
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
  const [selectedRestaurant, setSelectedRestaurant] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [eventData, setEventData] = useState<EventData | null>(null)

  useEffect(() => {
    // Get event data from URL parameters
    const eventType = searchParams.get('eventType') || 'Anniversary'
    const location = searchParams.get('location') || 'New York, NY'
    const date = searchParams.get('date') || ''
    const time = searchParams.get('time') || ''
    const guestCount = parseInt(searchParams.get('guestCount') || '2')
    const budget = searchParams.get('budget') || 'budget-2'
    const venue = searchParams.get('venue') || ''
    const services = searchParams.get('services')?.split(',').filter(Boolean) || []
    const servicesTotal = parseInt(searchParams.get('servicesTotal') || '0')

    const data: EventData = {
      eventType,
      location,
      date,
      time,
      guestCount,
      budget,
      venue,
      services,
      servicesTotal
    }

    setEventData(data)
  }, [searchParams])

  useEffect(() => {
    if (!eventData) return

    async function loadRecommendations() {
      setLoading(true)
      try {
        const recommendations = await getAIRecommendations({
          eventType: eventData!.eventType,
          guestCount: eventData!.guestCount,
          budget: eventData!.budget,
          location: eventData!.location
        })
        setAiRecommendations(recommendations)
      } catch (error) {
        console.error('Failed to load AI recommendations:', error)
      } finally {
        setLoading(false)
      }
    }

    loadRecommendations()
  }, [eventData])

  const getRecommendationForRestaurant = (restaurantId: string) => {
    return aiRecommendations.find(rec => rec.restaurantId === restaurantId)
  }

  const recommendedRestaurants = RESTAURANTS.filter(restaurant =>
    aiRecommendations.some(rec => rec.restaurantId === restaurant.id)
  )

  const getTotalCost = () => {
    if (!eventData || !selectedRestaurant) return 0
    const restaurantCost = getRestaurantPriceByGuestCount(selectedRestaurant, eventData.guestCount)
    return restaurantCost + eventData.servicesTotal
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
    if (!eventData || !selectedRestaurant) return true
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
            {eventData.venue ? '🏛️ Venue & Services Summary' : '🍽️ Perfect Restaurant Matches'}
          </h2>
          <p className="text-sm text-gray-600">
            {eventData.venue 
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
            {eventData.venue && <div>🏛️ {eventData.venue.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</div>}
          </div>
        </Card>

        {/* Venue Information */}
        {eventData.venue && (
          <Card className="p-4">
            <div className="text-sm font-medium text-purple-800 mb-2">🏛️ Selected Venue</div>
            <div className="bg-purple-50 p-3 rounded-lg">
              <div className="text-sm font-semibold text-purple-800 mb-1">
                {eventData.venue.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </div>
              <div className="text-xs text-purple-700">
                {eventData.venue === 'venue-boat' && 'Private yacht and boat rentals for unique waterfront events'}
                {eventData.venue === 'venue-private-home' && 'Luxury private homes available for events'}
                {eventData.venue === 'venue-restaurant' && 'Private dining rooms and restaurant venues'}
                {eventData.venue === 'venue-event-space' && 'Dedicated event spaces and halls'}
              </div>
              <div className="text-xs text-purple-600 mt-2">
                ✅ Venue is confirmed for your event
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

        {/* Loading State */}
        {!eventData.venue && loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-sm text-gray-600">Finding perfect restaurants for your event...</p>
          </div>
        )}

        {/* AI Recommendations */}
        {!eventData.venue && !loading && recommendedRestaurants.length > 0 && (
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
                  guestCount={eventData.guestCount}
                />
              ))}
                    </div>
                  </div>
        )}

        {/* No Recommendations */}
        {!eventData.venue && !loading && recommendedRestaurants.length === 0 && (
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

        {/* Cost Summary */}
        {(selectedRestaurant || eventData.venue) && (
          <Card className="p-4">
            <div className="text-sm font-medium text-purple-800 mb-2">💰 Cost Summary</div>
            <div className="space-y-2 text-xs">
              {selectedRestaurant && (
                <div className="flex justify-between">
                  <span>Restaurant Cost ({eventData.guestCount} guests):</span>
                  <span className="font-semibold">${getRestaurantPriceByGuestCount(selectedRestaurant, eventData.guestCount)}</span>
                </div>
              )}
              {eventData.venue && (
                <div className="flex justify-between">
                  <span>Venue Cost:</span>
                  <span className="font-semibold">$3,000 - $5,000</span>
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
                    ${eventData.servicesTotal + (selectedRestaurant ? getRestaurantPriceByGuestCount(selectedRestaurant, eventData.guestCount) : 0) + (eventData.venue ? 4000 : 0)}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Success Message */}
        {(selectedRestaurant || eventData.venue) && (
        <div className="bg-green-50 p-4 rounded-xl">
            <div className="text-sm font-medium text-green-800 mb-2">
              {selectedRestaurant ? '✅ Restaurant Selected!' : '✅ Venue Confirmed!'}
            </div>
          <div className="text-xs text-green-700">
              {selectedRestaurant 
                ? `Great choice! This restaurant is perfect for your ${eventData.eventType.toLowerCase()} celebration.`
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
              selectedRestaurant: selectedRestaurant
            })
            router.push(`/create/review?${params.toString()}`)
          }}
          disabled={!selectedRestaurant && !eventData.venue}
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
