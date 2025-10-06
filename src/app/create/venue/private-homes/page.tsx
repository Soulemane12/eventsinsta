'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { PRIVATE_HOMES, PrivateHome, searchPrivateHomes, getPrivateHomesByCapacity } from '@/data/privateHomes'
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

function PrivateHomeCard({
  home,
  isSelected,
  onSelect
}: {
  home: PrivateHome;
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
        <div className="text-2xl">🏠</div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <div className="font-semibold text-sm">{home.name}</div>
            <div className="text-sm font-bold text-purple-600">{home.price.description}</div>
          </div>
          <div className="text-xs text-gray-600 mb-1">{home.address}</div>
          <div className="text-xs text-gray-500 mb-2">
            👥 {home.capacity.min}-{home.capacity.max} guests • ⭐ {home.rating}
          </div>
          <div className="text-xs text-gray-600 mb-2">{home.description}</div>

          {/* Key Features */}
          <div className="flex flex-wrap gap-1 mb-2">
            {home.features.slice(0, 3).map((feature, index) => (
              <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                {feature}
              </span>
            ))}
            {home.features.length > 3 && (
              <span className="text-xs text-gray-500">+{home.features.length - 3} more</span>
            )}
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
              {home.features.map((feature, index) => (
                <div key={index} className="text-xs">• {feature}</div>
              ))}
            </div>
            <div><strong>Home Type:</strong> {home.type.charAt(0).toUpperCase() + home.type.slice(1)}</div>
            <div><strong>Location:</strong> {home.location}</div>
          </div>
        </div>
      )}
    </div>
  )
}

function PrivateHomesContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [selectedHome, setSelectedHome] = useState<string>('')
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

  // Filter homes based on search term and guest count
  let filteredHomes = PRIVATE_HOMES

  if (searchTerm) {
    filteredHomes = searchPrivateHomes(searchTerm)
  }

  if (guestCount) {
    const guests = parseInt(guestCount)
    if (!isNaN(guests)) {
      filteredHomes = filteredHomes.filter(home =>
        home.capacity.min <= guests && home.capacity.max >= guests
      )
    }
  }

  const valid = selectedHome

  function next() {
    if (valid) {
      const selectedHomeData = PRIVATE_HOMES.find(h => h.id === selectedHome)
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
        specificVenue: selectedHome,
        venueName: selectedHomeData?.name || '',
        venueAddress: selectedHomeData?.address || '',
        venuePrice: selectedHomeData?.price.starting.toString() || '0',
        venuePackage: 'Full Day Rental'
      })
      router.push(`/create/services?${params.toString()}`)
    }
  }

  return (
    <div className="max-w-md mx-auto min-h-screen bg-gray-50">
      <StepHeader step={4} title="Choose Private Home" />
      <div className="p-6 space-y-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Select Your Private Home</h2>
          <p className="text-sm text-gray-600">Choose the perfect private home for your event</p>
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
            placeholder="Search homes (e.g., penthouse, Manhattan, garden)..."
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
              Showing homes that can accommodate your guest count
            </div>
          </div>
        )}

        <div className="space-y-3">
          {filteredHomes.length > 0 ? (
            filteredHomes.map(home => (
              <PrivateHomeCard
                key={home.id}
                home={home}
                isSelected={selectedHome === home.id}
                onSelect={() => setSelectedHome(home.id)}
              />
            ))
          ) : (
            <div className="bg-yellow-50 p-4 rounded-xl text-center">
              <div className="text-sm font-medium text-yellow-800 mb-2">🔍 No Homes Found</div>
              <div className="text-xs text-yellow-700">
                No private homes match your search criteria. Try adjusting your search or guest count.
              </div>
            </div>
          )}
        </div>

        <div className="bg-purple-50 p-4 rounded-xl">
          <div className="text-sm font-medium text-purple-800 mb-2">🏠 Private Home Benefits</div>
          <div className="text-xs text-purple-700">
            Private homes offer unique character, exclusive access, and personalized settings for your special event.
          </div>
        </div>

        <Button onClick={next} disabled={!valid}>
          Continue to Services
        </Button>
      </div>
    </div>
  )
}

export default function PrivateHomes() {
  return (
    <Suspense fallback={
      <div className="max-w-md mx-auto min-h-screen bg-gray-50">
        <div className="p-6">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-sm text-gray-600">Loading private homes...</p>
          </div>
        </div>
      </div>
    }>
      <PrivateHomesContent />
    </Suspense>
  )
}