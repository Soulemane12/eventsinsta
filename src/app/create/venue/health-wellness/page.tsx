'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { HEALTH_WELLNESS_VENUES, HealthWellnessVenue } from '@/data/healthWellnessVenues'
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

function HealthWellnessVenueCard({
  venue,
  isSelected,
  onSelect,
  selectedPackage,
  onPackageSelect,
  guestCount
}: {
  venue: HealthWellnessVenue;
  isSelected: boolean;
  onSelect: () => void;
  selectedPackage?: string;
  onPackageSelect: (packageName: string, packagePrice: number) => void;
  guestCount: number;
}) {
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
        <div className="text-2xl">🧘‍♀️</div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <div className="font-semibold text-sm">{venue.name}</div>
            <div className="text-sm font-bold text-purple-600">{venue.priceRange}</div>
          </div>
          <div className="text-xs text-gray-600 mb-1">{venue.address}</div>
          <div className="text-xs text-gray-500 mb-2">
            👥 Up to {venue.capacity} people • 💰 {venue.priceRange}
          </div>
          <div className="text-xs text-gray-600 mb-2">{venue.description}</div>

          {/* Specialty Tags */}
          <div className="flex flex-wrap gap-1 mb-2">
            {venue.specialties.map((specialty) => (
              <span key={specialty} className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                {specialty}
              </span>
            ))}
          </div>

          {/* Package Selection - Only show when venue is selected */}
          {isSelected && (
            <div className="mt-3 pt-3 border-t border-purple-200">
              <div className="text-xs font-semibold text-purple-800 mb-2">📦 Select Package for {guestCount} guests:</div>
              <div className="space-y-2">
                {venue.packages.map((pkg) => {
                  const isPackageSelected = selectedPackage === pkg.name
                  const canAccommodate = pkg.maxPeople >= guestCount

                  return (
                    <button
                      key={pkg.name}
                      onClick={(e) => {
                        e.stopPropagation()
                        if (canAccommodate) {
                          onPackageSelect(pkg.name, pkg.price)
                        }
                      }}
                      disabled={!canAccommodate}
                      className={`w-full p-3 rounded-lg border text-left text-xs transition-all ${
                        isPackageSelected
                          ? 'bg-purple-100 border-purple-300 text-purple-800'
                          : canAccommodate
                          ? 'bg-gray-50 border-gray-200 hover:border-purple-300 text-gray-700'
                          : 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <div className="font-semibold">{pkg.name}</div>
                        <div className={`font-bold ${canAccommodate ? 'text-purple-600' : 'text-gray-400'}`}>
                          ${pkg.price.toLocaleString()}
                        </div>
                      </div>
                      <div className="text-xs mb-1">{pkg.description}</div>
                      <div className="text-xs">
                        ⏰ {pkg.duration} • 👥 Max {pkg.maxPeople} people
                        {!canAccommodate && (
                          <span className="text-red-500 ml-2">• Too many guests for this package</span>
                        )}
                      </div>
                      {isPackageSelected && (
                        <div className="mt-2 flex items-center text-purple-600">
                          ✓ Selected
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {isSelected && !selectedPackage && (
            <div className="mt-2 text-xs text-purple-600 font-medium">
              Please select a package to continue
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function HealthWellnessContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [selectedVenue, setSelectedVenue] = useState<string>('')
  const [selectedPackage, setSelectedPackage] = useState<string>('')
  const [selectedPackagePrice, setSelectedPackagePrice] = useState<number>(0)
  const [searchTerm, setSearchTerm] = useState('')
  const [eventType, setEventType] = useState('')
  const [location, setLocation] = useState('')
  const [date, setDate] = useState('')
  const [hostName, setHostName] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [guestCount, setGuestCount] = useState(1)
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
    if (guestCountParam) setGuestCount(parseInt(guestCountParam) || 1)
    if (budgetParam) setBudget(budgetParam)

  }, [searchParams])

  const venues = HEALTH_WELLNESS_VENUES

  // Filter venues based on search term
  const filteredVenues = venues.filter(venue =>
    venue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    venue.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    venue.specialties.some(specialty => specialty.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const valid = selectedVenue && selectedPackage

  function handleVenueSelect(venueId: string) {
    setSelectedVenue(venueId)
    setSelectedPackage('')
    setSelectedPackagePrice(0)
  }

  function handlePackageSelect(packageName: string, packagePrice: number) {
    setSelectedPackage(packageName)
    setSelectedPackagePrice(packagePrice)
  }

  function next() {
    if (valid) {
      const selectedVenueData = venues.find(v => v.id === selectedVenue)

      const params = new URLSearchParams({
        eventType: eventType,
        location: location,
        date: date,
        hostName: hostName,
        startTime: startTime,
        endTime: endTime,
        guestCount: guestCount.toString(),
        budget: budget,
        venue: 'venue-health-wellness',
        specificVenue: selectedVenue,
        venueName: selectedVenueData?.name || '',
        venueAddress: selectedVenueData?.address || '',
        venuePackage: selectedPackage,
        venuePrice: selectedPackagePrice.toString()
      })

      router.push(`/create/services?${params.toString()}`)
    }
  }

  return (
    <div className="max-w-md mx-auto min-h-screen bg-gray-50">
      <StepHeader step={4} title="Health & Wellness Venues" />
      <div className="p-6 space-y-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">🧘‍♀️ Choose Your Wellness Venue</h2>
          <p className="text-sm text-gray-600">Select from our curated health and wellness centers</p>
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
          <div className="mt-1 text-sm text-gray-600">
            👥 {guestCount} {guestCount === 1 ? 'guest' : 'guests'}
          </div>
        </div>

        {/* Search Input */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search wellness venues (e.g., biohack, boxing, therapy)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-12 rounded-xl border border-gray-300 px-4 outline-none focus:ring-2 focus:ring-purple-300"
          />
        </div>

        {/* Venue Cards */}
        <div className="space-y-4">
          {filteredVenues.length > 0 ? (
            filteredVenues.map((venue) => (
              <HealthWellnessVenueCard
                key={venue.id}
                venue={venue}
                isSelected={selectedVenue === venue.id}
                onSelect={() => handleVenueSelect(venue.id)}
                selectedPackage={selectedVenue === venue.id ? selectedPackage : undefined}
                onPackageSelect={handlePackageSelect}
                guestCount={guestCount}
              />
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-2">🔍</div>
              <p>No wellness venues found matching your search.</p>
              <p className="text-sm mt-1">Try searching for "biohack", "boxing", or "therapy"</p>
            </div>
          )}
        </div>

        <div className="mt-8">
          <Button onClick={next} disabled={!valid}>
            {selectedVenue && selectedPackage ?
              `Continue with ${venues.find(v => v.id === selectedVenue)?.name}` :
              'Select Venue & Package'
            }
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function HealthWellnessVenues() {
  return (
    <Suspense fallback={
      <div className="max-w-md mx-auto min-h-screen bg-gray-50">
        <div className="p-6">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-sm text-gray-600">Loading wellness venues...</p>
          </div>
        </div>
      </div>
    }>
      <HealthWellnessContent />
    </Suspense>
  )
}