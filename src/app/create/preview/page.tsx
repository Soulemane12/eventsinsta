'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
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
  specificVenue?: string
  venueName?: string
  venueAddress?: string
  venuePrice?: string
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
  if (!venueId) return 0

  // Use specific venue price if available
  if (venuePrice) {
    return parseInt(venuePrice) || 0
  }

  const venue = VENUE_SERVICES.find(v => v.id === venueId)
  if (!venue) return 0

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
    const specificVenue = searchParams.get('specificVenue') || ''
    const venueName = searchParams.get('venueName') || ''
    const venueAddress = searchParams.get('venueAddress') || ''
    const venuePrice = searchParams.get('venuePrice') || ''

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
      venuePrice
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
            <h2 className="text-xl font-semibold mb-2">📝 Review Your Event</h2>
            <p className="text-sm text-gray-600">
              Review your event details and selected services before booking
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
        {eventData.venue && (
          <Card className="p-4">
            <div className="text-sm font-medium text-purple-800 mb-2">
              {eventData.venue === 'venue-restaurant' ? '🍽️ Selected Restaurant' :
               eventData.venue === 'venue-sports-arena' ? '🏟️ Selected Sports Arena' :
               eventData.venue === 'venue-private-home' ? '🏠 Private Home Venue' :
               eventData.venue === 'venue-wedding' ? '💒 Wedding Venue' :
               eventData.venue === 'venue-yacht' ? '🛥️ Yacht Venue' :
               eventData.venue === 'venue-event-space' ? '🏛️ Event Space Venue' :
               eventData.venue === 'venue-health-wellness' ? '🧘‍♀️ Health & Wellness Venue' :
               '🏛️ Selected Venue'}
            </div>
            <div className="bg-purple-50 p-3 rounded-lg">
              <div className="text-sm font-semibold text-purple-800 mb-1">
                {eventData.venueName || getVenueDisplayName(eventData.venue)}
              </div>
              {eventData.venueAddress && (
                <div className="text-xs text-purple-700 mb-1">
                  📍 {eventData.venueAddress}
                </div>
              )}
              <div className="text-xs text-purple-700">
                {getVenueDescription(eventData.venue)}
              </div>
              <div className="text-xs text-purple-600 mt-2">
                ✅ Venue confirmed for your event
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






        {/* Cost Summary */}
        <Card className="p-4">
          <div className="text-sm font-medium text-purple-800 mb-2">💰 Cost Summary</div>
          <div className="space-y-2 text-xs">
            {eventData.venue && (
              <div className="flex justify-between">
                <span>🏛️ {eventData.venueName || getVenueDisplayName(eventData.venue)}:</span>
                <span className="font-semibold">${getVenueCost(eventData.venue, eventData.guestCount, eventData.venuePrice)}</span>
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

        {/* Success Message */}
        <div className="bg-green-50 p-4 rounded-xl">
          <div className="text-sm font-medium text-green-800 mb-2">
            ✅ Event Details Confirmed!
          </div>
          <div className="text-xs text-green-700">
            Perfect! Your event is ready to book. We've selected <strong>{eventData.venueName || getVenueDisplayName(eventData.venue)}</strong> for your {eventData.eventType.toLowerCase()} celebration.
          </div>
        </div>

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
              venuePrice: eventData.venuePrice || ''
            })
            router.push(`/create/review?${params.toString()}`)
          }}
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
