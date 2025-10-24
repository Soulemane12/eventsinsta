'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { VENUE_SERVICES } from '../../../data/services'
import { SERVICES } from '../../../data/services'
import { RESTAURANTS } from '../../../data/restaurants'
import { SPORTS_ARENAS } from '../../../data/sportsArenas'
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
  specificVenue?: string
  venueName?: string
  venueAddress?: string
  venuePrice?: string
  venuePackage?: string
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

function getVenueCost(venueId: string, guestCount: number, venuePrice?: string): number {
  console.log('getVenueCost called with:', { venueId, guestCount, venuePrice })

  if (!venueId) return 0

  // Use specific venue price if available
  if (venuePrice) {
    const price = parseInt(venuePrice) || 0
    console.log('Using venuePrice:', price)
    return price
  }

  const venue = VENUE_SERVICES.find(v => v.id === venueId)
  if (!venue) {
    console.log('No venue found for venueId:', venueId)
    return 0
  }

  console.log('Using venue base price:', venue.price)
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
  const [eventData, setEventData] = useState<EventData | null>(null)

  useEffect(() => {
    // Get event data from URL parameters
    const eventType = searchParams.get('eventType') || 'Anniversary'
    const location = searchParams.get('venueAddress') || searchParams.get('location') || 'New York, NY'
    const date = searchParams.get('date') || ''
    const time = searchParams.get('time') || ''
    const startTime = searchParams.get('startTime') || ''
    const endTime = searchParams.get('endTime') || ''
    const guestCount = parseInt(searchParams.get('guestCount') || '2')
    const budget = searchParams.get('budget') || 'budget-2'
    const venue = searchParams.get('venue') || ''
    const services = searchParams.get('services')?.split(',').filter(Boolean) || []
    const servicesTotal = parseInt(searchParams.get('servicesTotal') || '0')
    const specificVenue = searchParams.get('specificVenue') || ''
    const venueName = searchParams.get('venueName') || ''
    const venueAddress = searchParams.get('venueAddress') || ''
    const venuePrice = searchParams.get('venuePrice') || ''
    const venuePackage = searchParams.get('venuePackage') || ''

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
      servicesTotal,
      specificVenue,
      venueName,
      venueAddress,
      venuePrice,
      venuePackage
    }

    setEventData(data)
  }, [searchParams])



  const getTotalCost = () => {
    if (!eventData) return 0

    const venueCost = getVenueCost(eventData.venue, eventData.guestCount, eventData.venuePrice)
    return venueCost + eventData.servicesTotal
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
          <h2 className="text-xl font-semibold mb-2">📝 Complete Event Review</h2>
          <p className="text-sm text-gray-600">
            Review all your selections in detail before booking your perfect event
          </p>
        </div>

        {/* Comprehensive Event Summary */}
        <Card className="p-4">
          <div className="text-sm font-medium text-purple-800 mb-3">🎉 Your Event Overview</div>

          {/* Main Event Details */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg mb-3">
            <div className="text-center mb-3">
              <div className="text-lg font-bold text-purple-800">{eventData.eventType}</div>
              <div className="text-sm text-purple-600">📍 {eventData.location}</div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-white p-2 rounded">
                <div className="font-semibold text-gray-700">📅 Date</div>
                <div className="text-purple-600">{formatDate(eventData.date)}</div>
              </div>
              <div className="bg-white p-2 rounded">
                <div className="font-semibold text-gray-700">🕐 Time</div>
                <div className="text-purple-600">{formatTime(eventData.time)}</div>
              </div>
              <div className="bg-white p-2 rounded">
                <div className="font-semibold text-gray-700">👥 Guests</div>
                <div className="text-purple-600">{eventData.guestCount} people</div>
              </div>
              <div className="bg-white p-2 rounded">
                <div className="font-semibold text-gray-700">💰 Budget</div>
                <div className="text-purple-600">{getBudgetDisplay(eventData.budget)}</div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="bg-green-50 p-2 rounded">
              <div className="font-bold text-green-800">{eventData.services.length}</div>
              <div className="text-green-600">Services</div>
            </div>
            <div className="bg-blue-50 p-2 rounded">
              <div className="font-bold text-blue-800">1</div>
              <div className="text-blue-600">Venue</div>
            </div>
            <div className="bg-orange-50 p-2 rounded">
              <div className="font-bold text-orange-800">${getTotalCost()}</div>
              <div className="text-orange-600">Total Cost</div>
            </div>
          </div>
        </Card>


        {/* Detailed Venue Information */}
        {eventData.venue && (
          <Card className="p-4">
            <div className="text-sm font-medium text-purple-800 mb-3">
              {eventData.venue === 'venue-restaurant' ? '🍽️ Your Restaurant Details' :
               eventData.venue === 'venue-sports-arena' ? '🏟️ Your Sports Arena Details' :
               eventData.venue === 'venue-private-home' ? '🏠 Private Home Venue Details' :
               eventData.venue === 'venue-wedding' ? '💒 Wedding Venue Details' :
               eventData.venue === 'venue-yacht' ? '🛥️ Yacht Venue Details' :
               eventData.venue === 'venue-event-space' ? '🏛️ Event Space Details' :
               eventData.venue === 'venue-health-wellness' ? '🧘‍♀️ Health & Wellness Venue Details' :
               '🏛️ Your Venue Details'}
            </div>

            {/* Restaurant Details */}
            {eventData.venue === 'venue-restaurant' && eventData.specificVenue && (
              (() => {
                const restaurant = RESTAURANTS.find(r => r.id === eventData.specificVenue)
                return restaurant ? (
                  <div className="space-y-3">
                    {/* Basic Info */}
                    <div className="bg-purple-50 p-3 rounded-lg">
                      <div className="text-sm font-bold text-purple-800 mb-1">{restaurant.name}</div>
                      <div className="text-xs text-purple-700 mb-2">📍 {restaurant.address}</div>
                      <div className="text-xs text-purple-600 mb-2">{restaurant.description}</div>
                      <div className="flex flex-wrap gap-1 mb-2">
                        <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">{restaurant.cuisine}</span>
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">{restaurant.priceRange}</span>
                      </div>
                    </div>

                    {/* Contact Information */}
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <div className="text-xs font-semibold text-blue-800 mb-2">📞 Contact Information</div>
                      <div className="text-xs text-blue-700 space-y-1">
                        <div>Phone: {restaurant.phone}</div>
                        <div>Email: {restaurant.email}</div>
                        <div>Website: <a href={restaurant.website} className="underline" target="_blank" rel="noopener noreferrer">{restaurant.website}</a></div>
                      </div>
                    </div>

                    {/* Restaurant Features */}
                    <div className="bg-green-50 p-3 rounded-lg">
                      <div className="text-xs font-semibold text-green-800 mb-2">✨ Restaurant Features</div>
                      <div className="flex flex-wrap gap-1">
                        {restaurant.features.map((feature, idx) => (
                          <span key={idx} className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">{feature}</span>
                        ))}
                      </div>
                    </div>

                    {/* Operating Hours */}
                    <div className="bg-yellow-50 p-3 rounded-lg">
                      <div className="text-xs font-semibold text-yellow-800 mb-1">🕐 Operating Hours</div>
                      <div className="text-xs text-yellow-700">{restaurant.hours}</div>
                    </div>

                    {/* Selected Package (only show if a specific package is selected) */}
                    {eventData.venuePackage && (
                      <div className="bg-indigo-50 p-3 rounded-lg">
                        <div className="text-xs font-semibold text-indigo-800 mb-2">📦 Your Selected Package</div>
                        <div className="bg-white p-2 rounded border border-indigo-200">
                          <div className="flex justify-between items-start mb-1">
                            <div className="text-xs font-semibold text-indigo-800">{eventData.venuePackage}</div>
                            <div className="text-xs font-bold text-indigo-600">${eventData.venuePrice}</div>
                          </div>
                          <div className="text-xs text-indigo-600">
                            For {eventData.guestCount} guests
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <div className="text-sm font-semibold text-purple-800 mb-1">
                      {eventData.venueName || getVenueDisplayName(eventData.venue)}
                    </div>
                    <div className="text-xs text-purple-700">Restaurant details not available</div>
                  </div>
                )
              })()
            )}

            {/* Sports Arena Details */}
            {eventData.venue === 'venue-sports-arena' && eventData.specificVenue && (
              (() => {
                const arena = SPORTS_ARENAS.find(a => a.id === eventData.specificVenue)
                return arena ? (
                  <div className="space-y-3">
                    {/* Basic Info */}
                    <div className="bg-purple-50 p-3 rounded-lg">
                      <div className="text-sm font-bold text-purple-800 mb-1">{arena.name}</div>
                      <div className="text-xs text-purple-700 mb-2">📍 {arena.address}</div>
                      <div className="text-xs text-purple-600 mb-2">{arena.description}</div>
                      <div className="flex flex-wrap gap-1 mb-2">
                        <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">{arena.sportType}</span>
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">{arena.priceRange}</span>
                      </div>
                    </div>

                    {/* Contact Information */}
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <div className="text-xs font-semibold text-blue-800 mb-2">📞 Contact Information</div>
                      <div className="text-xs text-blue-700 space-y-1">
                        <div>Phone: {arena.phone}</div>
                        <div>Email: {arena.email}</div>
                        <div>Website: <a href={arena.website} className="underline" target="_blank" rel="noopener noreferrer">{arena.website}</a></div>
                      </div>
                    </div>

                    {/* Arena Features */}
                    <div className="bg-green-50 p-3 rounded-lg">
                      <div className="text-xs font-semibold text-green-800 mb-2">✨ Arena Features</div>
                      <div className="flex flex-wrap gap-1">
                        {arena.features.map((feature, idx) => (
                          <span key={idx} className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">{feature}</span>
                        ))}
                      </div>
                    </div>

                    {/* Operating Hours */}
                    <div className="bg-yellow-50 p-3 rounded-lg">
                      <div className="text-xs font-semibold text-yellow-800 mb-1">🕐 Operating Hours</div>
                      <div className="text-xs text-yellow-700">{arena.hours}</div>
                    </div>

                    {/* Selected Package (only show if a specific package is selected) */}
                    {eventData.venuePackage && (
                      <div className="bg-indigo-50 p-3 rounded-lg">
                        <div className="text-xs font-semibold text-indigo-800 mb-2">📦 Your Selected Package</div>
                        <div className="bg-white p-2 rounded border border-indigo-200">
                          <div className="flex justify-between items-start mb-1">
                            <div className="text-xs font-semibold text-indigo-800">{eventData.venuePackage}</div>
                            <div className="text-xs font-bold text-indigo-600">${eventData.venuePrice}</div>
                          </div>
                          <div className="text-xs text-indigo-600">
                            For {eventData.guestCount} guests
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <div className="text-sm font-semibold text-purple-800 mb-1">
                      {eventData.venueName || getVenueDisplayName(eventData.venue)}
                    </div>
                    <div className="text-xs text-purple-700">Sports arena details not available</div>
                  </div>
                )
              })()
            )}

            {/* Other Venue Types */}
            {!['venue-restaurant', 'venue-sports-arena'].includes(eventData.venue) && (
              <div className="bg-purple-50 p-3 rounded-lg">
                <div className="text-sm font-semibold text-purple-800 mb-1">
                  {eventData.venueName || getVenueDisplayName(eventData.venue)}
                </div>
                {eventData.venueAddress && (
                  <div className="text-xs text-purple-700 mb-1">
                    📍 {eventData.venueAddress}
                  </div>
                )}
                <div className="text-xs text-purple-700 mb-2">
                  {getVenueDescription(eventData.venue)}
                </div>
                <div className="text-xs text-purple-600">
                  ✅ Venue confirmed for your event
                </div>
              </div>
            )}
          </Card>
        )}

        {/* Detailed Services Information */}
        {eventData.services.length > 0 && (
          <Card className="p-4">
            <div className="text-sm font-medium text-purple-800 mb-3">🎯 Your Selected Services</div>
            <div className="space-y-3">
              {eventData.services.map(serviceId => {
                const service = SERVICES.find(s => s.id === serviceId)
                return service ? (
                  <div key={serviceId} className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{service.icon}</span>
                        <div>
                          <div className="text-sm font-semibold text-gray-800">{service.name}</div>
                          <div className="text-xs text-gray-600">{service.category}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-purple-600">${service.price}</div>
                        <div className="text-xs text-gray-500">{service.priceDescription}</div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-700 mb-2">{service.description}</div>
                    {service.instagram && (
                      <div className="text-xs text-blue-600">
                        📸 Follow: {service.instagram}
                      </div>
                    )}
                  </div>
                ) : null
              })}

              {/* Services Total */}
              <div className="border-t border-gray-200 pt-3 mt-3">
                <div className="bg-purple-50 p-3 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-sm font-bold text-purple-800">Total Services Cost</div>
                      <div className="text-xs text-purple-600">{eventData.services.length} services selected</div>
                    </div>
                    <div className="text-lg font-bold text-purple-800">${eventData.servicesTotal}</div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}






        {/* Detailed Cost Breakdown */}
        <Card className="p-4">
          <div className="text-sm font-medium text-purple-800 mb-3">💰 Complete Cost Breakdown</div>

          <div className="space-y-3">
            {/* Venue Cost */}
            {eventData.venue && (
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2">
                    <span>🏛️</span>
                    <div>
                      <div className="text-sm font-semibold text-blue-800">
                        {eventData.venueName || getVenueDisplayName(eventData.venue)}
                      </div>
                      <div className="text-xs text-blue-600">
                        {eventData.venuePackage || 'Venue Cost'}
                        {eventData.guestCount && ` • For ${eventData.guestCount} guests`}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm font-bold text-blue-800">
                    ${getVenueCost(eventData.venue, eventData.guestCount, eventData.venuePrice)}
                  </div>
                </div>
                {eventData.venueAddress && (
                  <div className="text-xs text-blue-600">📍 {eventData.venueAddress}</div>
                )}
              </div>
            )}

            {/* Services Cost */}
            {eventData.servicesTotal > 0 && (
              <div className="bg-green-50 p-3 rounded-lg">
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2">
                    <span>🎯</span>
                    <div>
                      <div className="text-sm font-semibold text-green-800">All Services</div>
                      <div className="text-xs text-green-600">{eventData.services.length} services included</div>
                    </div>
                  </div>
                  <div className="text-sm font-bold text-green-800">${eventData.servicesTotal}</div>
                </div>
              </div>
            )}

            {/* Budget Status */}
            <div className="bg-yellow-50 p-3 rounded-lg">
              <div className="text-xs font-semibold text-yellow-800 mb-1">💡 Budget Analysis</div>
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-xs text-yellow-700">Your Budget: {getBudgetDisplay(eventData.budget)}</div>
                  <div className="text-xs text-yellow-600">Total Cost: ${getTotalCost()}</div>
                </div>
                <div className="text-xs font-semibold text-yellow-800">
                  {(() => {
                    const total = getTotalCost()
                    const budgetRange = getBudgetRange(eventData.budget)
                    return total <= budgetRange.max ? '✅ Within Budget' : '⚠️ Over Budget'
                  })()}
                </div>
              </div>
            </div>

            {/* Final Total */}
            <div className="bg-gradient-to-r from-purple-100 to-purple-50 p-4 rounded-lg border-2 border-purple-200">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-lg font-bold text-purple-800">Grand Total</div>
                  <div className="text-xs text-purple-600">All costs included</div>
                </div>
                <div className="text-2xl font-bold text-purple-800">${getTotalCost()}</div>
              </div>
            </div>
          </div>
        </Card>

        {/* Comprehensive Success Summary */}
        <Card className="p-4 border-2 border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
          <div className="text-sm font-bold text-green-800 mb-3 text-center">
            🎉 Your Event is Ready to Book!
          </div>

          <div className="space-y-3">
            {/* Event Confirmation */}
            <div className="bg-white p-3 rounded-lg border border-green-200">
              <div className="text-xs font-semibold text-green-800 mb-2">📝 Event Confirmed</div>
              <div className="text-xs text-green-700">
                <strong>{eventData.eventType}</strong> for <strong>{eventData.guestCount} guests</strong> on <strong>{formatDate(eventData.date)}</strong> at <strong>{formatTime(eventData.time)}</strong>
              </div>
            </div>

            {/* Venue Confirmation */}
            <div className="bg-white p-3 rounded-lg border border-green-200">
              <div className="text-xs font-semibold text-green-800 mb-2">🏛️ Venue Secured</div>
              <div className="text-xs text-green-700">
                <strong>{eventData.venueName || getVenueDisplayName(eventData.venue)}</strong>
                {eventData.venueAddress && (
                  <>
                    <br />📍 {eventData.venueAddress}
                  </>
                )}
              </div>
            </div>

            {/* Services Confirmation */}
            {eventData.services.length > 0 && (
              <div className="bg-white p-3 rounded-lg border border-green-200">
                <div className="text-xs font-semibold text-green-800 mb-2">🎯 Services Booked</div>
                <div className="text-xs text-green-700">
                  {eventData.services.length} premium services totaling <strong>${eventData.servicesTotal}</strong>
                </div>
              </div>
            )}

            {/* Next Steps */}
            <div className="bg-white p-3 rounded-lg border border-green-200">
              <div className="text-xs font-semibold text-green-800 mb-2">🚀 What's Next?</div>
              <div className="text-xs text-green-700 space-y-1">
                <div>• Review final details and complete booking</div>
                <div>• Receive confirmation and vendor contacts</div>
                <div>• Coordinate with your selected service providers</div>
                <div>• Enjoy your perfectly planned event!</div>
              </div>
            </div>
          </div>
        </Card>

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
              specificVenue: eventData.specificVenue || '',
              venueName: eventData.venueName || '',
              venueAddress: eventData.venueAddress || '',
              venuePrice: eventData.venuePrice || '',
              venuePackage: eventData.venuePackage || ''
            })
            router.push(`/create/sponsorship?${params.toString()}`)
          }}
        >
          Next: Sponsorship Options
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
