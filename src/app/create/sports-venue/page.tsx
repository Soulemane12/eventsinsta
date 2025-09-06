'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
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
  const pct = (step / 7) * 100
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

interface SportsVenue {
  id: string
  name: string
  description: string
  capacity: string
  features: string[]
  price: string
  match: string
  matchPercentage: number
  icon: string
}

const SPORTS_VENUES: SportsVenue[] = [
  {
    id: 'madison-square-garden',
    name: 'Madison Square Garden',
    description: 'The world\'s most famous arena, perfect for large-scale events, corporate gatherings, and special celebrations.',
    capacity: '2-20,000 guests',
    features: ['NY Knicks Games', 'Boxing Matches', 'Basketball Tournaments', 'Private Suites', 'Premium Catering', 'VIP Access'],
    price: '$15,000 - $50,000',
    match: 'Perfect Match',
    matchPercentage: 95,
    icon: '🏟️'
  },
  {
    id: 'barclays-center',
    name: 'Barclays Center',
    description: 'Modern sports and entertainment venue in Brooklyn, perfect for large events and sporting competitions.',
    capacity: '2-19,000 guests',
    features: ['Brooklyn Nets Games', 'Concerts', 'Boxing Events', 'Private Suites', 'Premium Dining', 'VIP Parking'],
    price: '$12,000 - $40,000',
    match: 'Perfect Match',
    matchPercentage: 90,
    icon: '🏟️'
  },
  {
    id: 'yankee-stadium',
    name: 'Yankee Stadium',
    description: 'Historic baseball stadium with premium event spaces, perfect for large gatherings and corporate events.',
    capacity: '2-50,000 guests',
    features: ['Yankees Games', 'Private Suites', 'Premium Catering', 'Historic Venue', 'VIP Access', 'Parking'],
    price: '$10,000 - $35,000',
    match: 'Good Match',
    matchPercentage: 85,
    icon: '⚾'
  }
]

function SportsVenueCard({ 
  venue, 
  onSelect, 
  isSelected, 
  guestCount 
}: { 
  venue: SportsVenue
  onSelect: (venueId: string) => void
  isSelected: boolean
  guestCount: number
}) {
  const getMatchColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-600 bg-green-50'
    if (percentage >= 80) return 'text-blue-600 bg-blue-50'
    return 'text-yellow-600 bg-yellow-50'
  }

  const getMatchText = (percentage: number) => {
    if (percentage >= 90) return 'Perfect Match'
    if (percentage >= 80) return 'Good Match'
    return 'Fair Match'
  }

  return (
    <div className={`rounded-2xl bg-white shadow p-4 cursor-pointer transition-all ${isSelected ? 'ring-2 ring-purple-500 bg-purple-50' : 'hover:shadow-lg'}`}
         onClick={() => onSelect(venue.id)}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="text-2xl">{venue.icon}</div>
          <div>
            <h3 className="font-semibold text-gray-900">{venue.name}</h3>
            <p className="text-sm text-gray-600">{venue.description}</p>
          </div>
        </div>
        <div className={`px-2 py-1 rounded-full text-xs font-medium ${getMatchColor(venue.matchPercentage)}`}>
          {getMatchText(venue.matchPercentage)}
        </div>
      </div>
      
      <div className="text-xs text-gray-600 mb-3">
        📍 New York, NY
      </div>
      
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs text-gray-500">⭐</span>
        <span className="text-xs font-medium text-gray-700">
          {getMatchText(venue.matchPercentage)}
        </span>
        <span className="text-xs text-gray-500">
          ({venue.matchPercentage}% match)
        </span>
      </div>
      
      <div className="text-xs text-gray-600 mb-3">
        Guest count is within capacity, and it's a premium sports venue in New York, NY
      </div>
      
      <div className="text-sm font-semibold text-purple-600 mb-2">
        Best Package: Sports Event Package
      </div>
      
      <div className="text-sm text-gray-700 mb-2">
        Price for {guestCount} guests
      </div>
      
      <div className="text-lg font-bold text-purple-600 mb-3">
        {venue.price}
      </div>
      
      <div className="text-xs text-gray-600 mb-2">
        Capacity: {venue.capacity}
      </div>
      
      <div className="flex flex-wrap gap-1 mb-3">
        {venue.features.slice(0, 4).map((feature, index) => (
          <span key={index} className="px-2 py-1 bg-gray-100 text-xs text-gray-600 rounded">
            {feature}
          </span>
        ))}
        {venue.features.length > 4 && (
          <span className="px-2 py-1 bg-gray-100 text-xs text-gray-600 rounded">
            +{venue.features.length - 4} more
          </span>
        )}
      </div>
      
      <div className="text-xs text-blue-600 mb-3">
        Show Details
      </div>
      
      <Button 
        className="!h-10 text-sm"
        onClick={(e) => {
          e.stopPropagation()
          onSelect(venue.id)
        }}
      >
        Select This Venue
      </Button>
    </div>
  )
}

function SportsVenueContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [selectedVenue, setSelectedVenue] = useState<string>('')
  const [eventData, setEventData] = useState<any>(null)

  useEffect(() => {
    // Get event data from URL parameters
    const eventType = searchParams.get('eventType') || 'Sporting Events'
    const location = searchParams.get('location') || 'New York, NY'
    const date = searchParams.get('date') || ''
    const time = searchParams.get('time') || ''
    const guestCount = parseInt(searchParams.get('guestCount') || '2')
    const budget = searchParams.get('budget') || 'budget-2'
    const venue = searchParams.get('venue') || ''
    const services = searchParams.get('services')?.split(',').filter(Boolean) || []
    const servicesTotal = parseInt(searchParams.get('servicesTotal') || '0')

    const data = {
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

  if (!eventData) {
    return (
      <div className="max-w-md mx-auto min-h-screen bg-gray-50">
        <StepHeader step={6} title="Choose Your Sports Venue" />
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
      <StepHeader step={6} title="Choose Your Sports Venue" />
      <div className="p-6 space-y-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">🏟️ Choose Your Sports Venue</h2>
          <p className="text-sm text-gray-600">
            Select from our curated list of sports venues for your event
          </p>
        </div>

        {/* Event Summary */}
        <Card className="p-4">
          <div className="text-sm font-medium text-purple-800 mb-2">Your Event Details</div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>🎉 {eventData.eventType}</div>
            <div>📍 {eventData.location}</div>
            <div>📅 {eventData.date}</div>
            <div>👥 {eventData.guestCount} guests</div>
            <div>💰 {eventData.budget}</div>
            <div>🕐 {eventData.time}</div>
          </div>
        </Card>

        {/* Sports Venue Selection Info */}
        <Card className="p-4">
          <div className="text-sm font-medium text-purple-800 mb-2">🏟️ Sports Venue Selected</div>
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="text-sm font-semibold text-blue-800 mb-1">
              Sports Venue
            </div>
            <div className="text-xs text-blue-700">
              You've chosen to host your event at a sports venue. Below you'll find our recommended sports venues that are perfect for your event type, guest count, and budget.
            </div>
            <div className="text-xs text-blue-600 mt-2">
              💡 Select a sports venue below to proceed with your booking
            </div>
          </div>
        </Card>

        {/* Services Summary */}
        {eventData.services.length > 0 && (
          <Card className="p-4">
            <div className="text-sm font-medium text-purple-800 mb-2">Selected Services</div>
            <div className="space-y-2">
              {eventData.services.map((serviceId: string) => (
                <div key={serviceId} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span>🏀</span>
                    <span className="text-gray-700">Sports Service</span>
                  </div>
                  <span className="font-semibold text-purple-600">$1000</span>
                </div>
              ))}
              <div className="border-t border-gray-200 pt-2 mt-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-purple-800">Total Services Cost</span>
                  <span className="text-purple-800">${eventData.servicesTotal}</span>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Sports Venue Recommendations */}
        <div>
          <h3 className="text-lg font-semibold mb-3">🏟️ Recommended Sports Venues</h3>
          <div className="space-y-4">
            {SPORTS_VENUES.map((venue) => (
              <SportsVenueCard
                key={venue.id}
                venue={venue}
                onSelect={setSelectedVenue}
                isSelected={selectedVenue === venue.id}
                guestCount={eventData.guestCount}
              />
            ))}
          </div>
        </div>

        {/* Cost Summary */}
        {selectedVenue && (
          <Card className="p-4">
            <div className="text-sm font-medium text-purple-800 mb-2">💰 Cost Summary</div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span>Sports Venue Cost ({eventData.guestCount} guests):</span>
                <span className="font-semibold">$15,000 - $50,000</span>
              </div>
              {eventData.servicesTotal > 0 && (
                <div className="flex justify-between">
                  <span>Services Cost:</span>
                  <span className="font-semibold">${eventData.servicesTotal}</span>
                </div>
              )}
              <div className="border-t border-gray-200 pt-2 mt-2">
                <div className="flex justify-between font-bold">
                  <span>Total Cost:</span>
                  <span className="text-purple-600">$16,000 - $51,000</span>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Success Message */}
        {selectedVenue && (
          <div className="bg-green-50 p-4 rounded-xl">
            <div className="text-sm font-medium text-green-800 mb-2">
              ✅ Sports Venue Selected!
            </div>
            <div className="text-xs text-green-700">
              Great choice! This sports venue is perfect for your {eventData.eventType.toLowerCase()} celebration. 🏀 Perfect for sporting events like NY Knicks games, boxing matches, or basketball tournaments!
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
              venue: selectedVenue,
              services: eventData.services.join(','),
              servicesTotal: eventData.servicesTotal.toString()
            })
            router.push(`/create/preview?${params.toString()}`)
          }}
          disabled={!selectedVenue}
        >
          Next: Book & Celebrate!
        </Button>
      </div>
    </div>
  )
}

export default function SportsVenue() {
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
      <SportsVenueContent />
    </Suspense>
  )
}
