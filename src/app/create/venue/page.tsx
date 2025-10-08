'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { VENUE_SERVICES, Service } from '@/data/services'
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

function VenueCard({ 
  venue, 
  isSelected, 
  onSelect 
}: { 
  venue: Service; 
  isSelected: boolean; 
  onSelect: () => void 
}) {
  return (
    <div
      className={`w-full p-4 transition-all rounded-2xl bg-white shadow cursor-pointer ${
        isSelected 
          ? 'border-2 border-purple-600 bg-purple-50' 
          : venue.id === 'venue-yacht' 
            ? 'border-2 border-blue-300 bg-blue-50 hover:border-blue-400' 
            : 'border border-gray-200 hover:border-purple-300'
      }`}
      onClick={onSelect}
    >
      <div className="flex items-start gap-3">
        <div className="text-3xl">{venue.icon}</div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <div className="font-semibold text-sm">{venue.name}</div>
            {venue.id === 'venue-yacht' && (
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Popular</span>
            )}
          </div>
          <div className="text-xs text-gray-600 mb-2">{venue.description}</div>
          {isSelected && (
            <div className="w-4 h-4 bg-purple-600 rounded-full flex items-center justify-center ml-auto">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function VenueContent() {
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
    
    if (eventTypeParam) setEventType(eventTypeParam)
    if (locationParam) setLocation(locationParam)
    if (dateParam) setDate(dateParam)
    if (hostNameParam) setHostName(hostNameParam)
    if (startTimeParam) setStartTime(startTimeParam)
    if (endTimeParam) setEndTime(endTimeParam)
    if (guestCountParam) setGuestCount(guestCountParam)
    if (budgetParam) setBudget(budgetParam)
    
  }, [searchParams])

  const venueServices = VENUE_SERVICES
  
  // Filter venues based on search term
  const filteredVenues = venueServices.filter(venue => 
    venue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    venue.description.toLowerCase().includes(searchTerm.toLowerCase())
  )
  
  // Check if yacht venue is available
  const yachtVenue = venueServices.find(v => v.id === 'venue-yacht')
  const yachtAvailable = yachtVenue !== undefined

  const valid = selectedVenue

  function next() {
    if (valid) {
      const params = new URLSearchParams({
        eventType: eventType,
        location: location,
        date: date,
        hostName: hostName,
        startTime: startTime,
        endTime: endTime,
        guestCount: guestCount,
        budget: budget,
        venue: selectedVenue
      })

      // Route to specific venue selection pages for detailed venue types
      if (selectedVenue === 'venue-restaurant') {
        router.push(`/create/venue/restaurants?${params.toString()}`)
      } else if (selectedVenue === 'venue-sports-arena') {
        router.push(`/create/venue/sports-arenas?${params.toString()}`)
      } else if (selectedVenue === 'venue-private-home') {
        router.push(`/create/venue/private-homes?${params.toString()}`)
      } else if (selectedVenue === 'venue-wedding') {
        router.push(`/create/venue/wedding-venues?${params.toString()}`)
      } else {
        // Go directly to services for other venue types
        router.push(`/create/services?${params.toString()}`)
      }
    }
  }

  return (
    <div className="max-w-md mx-auto min-h-screen bg-gray-50">
      <StepHeader step={4} title="Select Your Venue" />
      <div className="p-6 space-y-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Choose Your Venue</h2>
          <p className="text-sm text-gray-600">Select the perfect venue for your event</p>
          {eventType && location && (
            <div className="mt-2 text-sm text-purple-600 font-medium">
              Planning: {eventType} in {location}
            </div>
          )}
          {date && (
            <div className="mt-1 text-sm text-gray-600">
              📅 {date}
              {startTime && endTime ? (
                <> • ⏰ {startTime} - {endTime}</>
              ) : (
                <> • ⏰ Time not set</>
              )}
            </div>
          )}
        </div>

        {/* Search Input */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search venues (e.g., yacht, restaurant, wedding)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-12 rounded-xl border border-gray-300 px-4 outline-none focus:ring-2 focus:ring-purple-300"
          />
        </div>

        {/* AI Error Handling - Show if yacht is not available */}
        {!yachtAvailable && (
          <div className="bg-red-50 p-4 rounded-xl mb-4">
            <div className="text-sm font-medium text-red-800 mb-2">🤖 AI Analysis: Yacht Venue Issue</div>
            <div className="text-xs text-red-700">
              The yacht venue is not currently available in our system. This could be due to:
              <ul className="mt-2 ml-4 list-disc">
                <li>Seasonal availability restrictions</li>
                <li>Maintenance or booking conflicts</li>
                <li>System configuration issue</li>
              </ul>
              Please try selecting a different venue or contact support for assistance.
            </div>
          </div>
        )}

        {/* Yacht Venue Highlight */}
        {yachtAvailable && searchTerm.toLowerCase().includes('yacht') && (
          <div className="bg-blue-50 p-4 rounded-xl mb-4">
            <div className="text-sm font-medium text-blue-800 mb-2">🛥️ Yacht Venue Available!</div>
            <div className="text-xs text-blue-700">
              Great news! The yacht venue is available for your event. Look for the yacht option below with the 🛥️ icon.
            </div>
          </div>
        )}

        <div className="space-y-3">
          {filteredVenues.length > 0 ? (
            filteredVenues.map(venue => (
              <VenueCard
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
                No venues match your search term "{searchTerm}". Try searching for "yacht", "restaurant", "wedding", or "sports".
              </div>
            </div>
          )}
        </div>

        <div className="bg-blue-50 p-4 rounded-xl">
          <div className="text-sm font-medium text-blue-800 mb-2">💡 Venue Selection Tip</div>
          <div className="text-xs text-blue-700">
            Choose your venue first, then we'll help you select the perfect services to complement your venue choice.
          </div>
        </div>

        <Button onClick={next} disabled={!valid}>
          {selectedVenue === 'venue-restaurant' ? 'Continue to Restaurant' :
           selectedVenue === 'venue-sports-arena' ? 'Continue to Sports Arena' :
           selectedVenue === 'venue-private-home' ? 'Continue to Private Home' :
           selectedVenue === 'venue-wedding' ? 'Continue to Wedding Venue' :
           'Continue to Services'}
        </Button>
      </div>
    </div>
  )
}

export default function Venue() {
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
      <VenueContent />
    </Suspense>
  )
}
