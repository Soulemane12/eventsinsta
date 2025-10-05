'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { WEDDING_VENUES, WeddingVenue, searchWeddingVenues } from '@/data/weddingVenues'
import Logo from '../../../../components/Logo'

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

function WeddingVenueCard({
  venue,
  isSelected,
  onSelect
}: {
  venue: WeddingVenue;
  isSelected: boolean;
  onSelect: () => void
}) {
  const [showDetails, setShowDetails] = useState(false)

  return (
    <div
      className={`w-full p-4 transition-all rounded-2xl bg-white shadow cursor-pointer ${
        isSelected
          ? 'border-2 border-purple-600 bg-purple-50'
          : 'border border-gray-200 hover:border-purple-300'
      }`}
      onClick={onSelect}
    >
      <div className="flex items-start gap-3">
        <div className="text-2xl">💒</div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <div className="font-semibold text-sm">{venue.name}</div>
            <div className="text-sm font-bold text-purple-600">{venue.price.description}</div>
          </div>
          <div className="text-xs text-gray-600 mb-1">{venue.address}</div>
          <div className="text-xs text-gray-500 mb-2">
            👥 {venue.capacity.min}-{venue.capacity.max} guests • ⭐ {venue.rating}
          </div>
          <div className="text-xs text-gray-600 mb-2">{venue.description}</div>

          {/* Key Features */}
          <div className="flex flex-wrap gap-1 mb-2">
            {venue.features.slice(0, 3).map((feature, index) => (
              <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                {feature}
              </span>
            ))}
            {venue.features.length > 3 && (
              <span className="text-xs text-gray-500">+{venue.features.length - 3} more</span>
            )}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1 mb-2">
            {venue.tags.slice(0, 3).map((tag, index) => (
              <span key={index} className="text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded-full">
                {tag}
              </span>
            ))}
          </div>

          {isSelected && (
            <div className="w-4 h-4 bg-purple-600 rounded-full flex items-center justify-center ml-auto">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
          )}
        </div>
      </div>

      {/* Toggle Details Button */}
      <div className="mt-3 pt-3 border-t border-gray-100">
        <button
          onClick={(e) => {
            e.stopPropagation()
            setShowDetails(!showDetails)
          }}
          className="text-xs text-purple-600 hover:text-purple-800 font-medium"
        >
          {showDetails ? 'Hide Details' : 'View All Features'}
        </button>
      </div>

      {/* Expandable Details */}
      {showDetails && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="text-xs text-gray-600 space-y-2">
            <div><strong>All Features:</strong></div>
            <div className="grid grid-cols-2 gap-1">
              {venue.features.map((feature, index) => (
                <div key={index} className="text-xs">• {feature}</div>
              ))}
            </div>
            <div><strong>Style:</strong> {venue.tags.join(', ')}</div>
            <div><strong>Location:</strong> {venue.location}</div>
          </div>
        </div>
      )}
    </div>
  )
}

function WeddingVenuesContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [selectedVenue, setSelectedVenue] = useState<string>('')
  const [searchTerm, setSearchTerm] = useState('')
  const [eventType, setEventType] = useState('')
  const [location, setLocation] = useState('')
  const [date, setDate] = useState('')
  const [hostName, setHostName] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [guestCount, setGuestCount] = useState('')
  const [budget, setBudget] = useState('')
  const [venue, setVenue] = useState('')

  useEffect(() => {
    // Get previous parameters from URL
    const eventTypeParam = searchParams.get('eventType')
    const locationParam = searchParams.get('location')
    const dateParam = searchParams.get('date')
    const hostNameParam = searchParams.get('hostName')
    const startTimeParam = searchParams.get('startTime')
    const endTimeParam = searchParams.get('endTime')
    const guestCountParam = searchParams.get('guestCount')
    const budgetParam = searchParams.get('budget')
    const venueParam = searchParams.get('venue')

    if (eventTypeParam) setEventType(eventTypeParam)
    if (locationParam) setLocation(locationParam)
    if (dateParam) setDate(dateParam)
    if (hostNameParam) setHostName(hostNameParam)
    if (startTimeParam) setStartTime(startTimeParam)
    if (endTimeParam) setEndTime(endTimeParam)
    if (guestCountParam) setGuestCount(guestCountParam)
    if (budgetParam) setBudget(budgetParam)
    if (venueParam) setVenue(venueParam)
  }, [searchParams])

  // Filter venues based on search term and guest count
  let filteredVenues = WEDDING_VENUES

  if (searchTerm) {
    filteredVenues = searchWeddingVenues(searchTerm)
  }

  if (guestCount) {
    const guests = parseInt(guestCount)
    if (!isNaN(guests)) {
      filteredVenues = filteredVenues.filter(venue =>
        venue.capacity.min <= guests && venue.capacity.max >= guests
      )
    }
  }

  const valid = selectedVenue

  function next() {
    if (valid) {
      const selectedVenueData = WEDDING_VENUES.find(v => v.id === selectedVenue)
      const params = new URLSearchParams({
        eventType: eventType,
        location: location,
        date: date,
        hostName: hostName,
        startTime: startTime,
        endTime: endTime,
        guestCount: guestCount,
        budget: budget,
        venue: venue,
        specificVenue: selectedVenue,
        venueName: selectedVenueData?.name || '',
        venueAddress: selectedVenueData?.address || '',
        venuePrice: selectedVenueData?.price.starting.toString() || '0'
      })
      router.push(`/create/services?${params.toString()}`)
    }
  }

  return (
    <div className="max-w-md mx-auto min-h-screen bg-gray-50">
      <StepHeader step={4} title="Choose Wedding Venue" />
      <div className="p-6 space-y-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Select Your Wedding Venue</h2>
          <p className="text-sm text-gray-600">Choose the perfect venue for your special day</p>
          {eventType && location && (
            <div className="mt-2 text-sm text-purple-600 font-medium">
              Planning: {eventType} in {location}
            </div>
          )}
          {guestCount && (
            <div className="mt-1 text-sm text-gray-600">
              👥 {guestCount} guests
            </div>
          )}
        </div>

        {/* Search Input */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search venues (e.g., ballroom, garden, waterfront)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-12 rounded-xl border border-gray-300 px-4 outline-none focus:ring-2 focus:ring-purple-300"
          />
        </div>

        {/* Guest Count Filter Info */}
        {guestCount && (
          <div className="bg-blue-50 p-3 rounded-xl">
            <div className="text-sm font-medium text-blue-800 mb-1">🎯 Filtered for {guestCount} guests</div>
            <div className="text-xs text-blue-700">
              Showing venues that can accommodate your guest count
            </div>
          </div>
        )}

        <div className="space-y-3">
          {filteredVenues.length > 0 ? (
            filteredVenues.map(venue => (
              <WeddingVenueCard
                key={venue.id}
                venue={venue}
                isSelected={selectedVenue === venue.id}
                onSelect={() => setSelectedVenue(venue.id)}
              />
            ))
          ) : (
            <div className="bg-yellow-50 p-4 rounded-xl text-center">
              <div className="text-sm font-medium text-yellow-800 mb-2">🔍 No Venues Found</div>
              <div className="text-xs text-yellow-700">
                No wedding venues match your search criteria. Try adjusting your search or guest count.
              </div>
            </div>
          )}
        </div>

        <div className="bg-purple-50 p-4 rounded-xl">
          <div className="text-sm font-medium text-purple-800 mb-2">💒 Wedding Venue Benefits</div>
          <div className="text-xs text-purple-700">
            Our wedding venues offer full-service packages with professional planning, catering options, and stunning settings for your special day.
          </div>
        </div>

        <Button onClick={next} disabled={!valid}>
          Continue to Services
        </Button>
      </div>
    </div>
  )
}

export default function WeddingVenues() {
  return (
    <Suspense fallback={
      <div className="max-w-md mx-auto min-h-screen bg-gray-50">
        <div className="p-6">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-sm text-gray-600">Loading wedding venues...</p>
          </div>
        </div>
      </div>
    }>
      <WeddingVenuesContent />
    </Suspense>
  )
}