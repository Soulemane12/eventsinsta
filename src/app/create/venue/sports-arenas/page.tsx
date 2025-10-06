'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { SPORTS_ARENAS, SportsArena } from '@/data/sportsArenas'
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

function SportsArenaCard({
  arena,
  isSelected,
  onSelect,
  selectedPackage,
  onPackageSelect,
  guestCount
}: {
  arena: SportsArena;
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
        <div className="text-2xl">🏟️</div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <div className="font-semibold text-sm">{arena.name}</div>
            <div className="text-sm font-bold text-purple-600">{arena.priceRange}</div>
          </div>
          <div className="text-xs text-gray-600 mb-1">{arena.address}</div>
          <div className="text-xs text-gray-500 mb-2">
            🏟️ {arena.sportType} • 💰 {arena.priceRange}
          </div>
          <div className="text-xs text-gray-600 mb-2">{arena.description}</div>

          {/* Sport Type Tags */}
          <div className="flex flex-wrap gap-1 mb-2">
            <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
              {arena.sportType}
            </span>
            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
              {arena.priceRange}
            </span>
          </div>

          {/* Package Selection - Only show when arena is selected */}
          {isSelected && (
            <div className="mt-3 pt-3 border-t border-purple-200">
              <div className="text-xs font-semibold text-purple-800 mb-2">📦 Select Package for {guestCount} guests:</div>
              <div className="space-y-2">
                {arena.packages.map((pkg, idx) => {
                  const isPackageSelected = selectedPackage === pkg.name
                  const isApplicable = !pkg.guestCount || guestCount <= pkg.guestCount

                  return (
                    <div
                      key={idx}
                      className={`p-2 rounded border cursor-pointer transition-all ${
                        isPackageSelected
                          ? 'border-purple-500 bg-purple-100'
                          : isApplicable
                            ? 'border-gray-200 hover:border-purple-300 bg-gray-50'
                            : 'border-gray-100 bg-gray-100 opacity-50 cursor-not-allowed'
                      }`}
                      onClick={(e) => {
                        e.stopPropagation()
                        if (isApplicable) {
                          onPackageSelect(pkg.name, pkg.price)
                        }
                      }}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <div className="text-xs font-semibold text-gray-800">{pkg.name}</div>
                        <div className="text-xs font-bold text-purple-600">${pkg.price}</div>
                      </div>
                      <div className="text-xs text-gray-600 mb-1">{pkg.description}</div>
                      <div className="text-xs text-gray-500">
                        Includes: {pkg.includes.join(', ')}
                        {pkg.guestCount && ` • Up to ${pkg.guestCount} guests`}
                      </div>
                      {!isApplicable && (
                        <div className="text-xs text-red-500 mt-1">
                          Not suitable for {guestCount} guests
                        </div>
                      )}
                      {isPackageSelected && (
                        <div className="text-xs text-purple-600 mt-1 font-semibold">
                          ✅ Selected Package
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function SportsArenasContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [selectedSportsArena, setSelectedSportsArena] = useState<string>('')
  const [selectedPackage, setSelectedPackage] = useState<string>('')
  const [selectedPackagePrice, setSelectedPackagePrice] = useState<number>(0)
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

  // Filter sports arenas based on search term
  let filteredSportsArenas = SPORTS_ARENAS

  if (searchTerm) {
    filteredSportsArenas = SPORTS_ARENAS.filter(arena =>
      arena.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      arena.sportType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      arena.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      arena.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }

  const valid = selectedSportsArena && selectedPackage

  const handlePackageSelect = (packageName: string, packagePrice: number) => {
    setSelectedPackage(packageName)
    setSelectedPackagePrice(packagePrice)
  }

  function next() {
    if (valid) {
      const selectedSportsArenaData = SPORTS_ARENAS.find(a => a.id === selectedSportsArena)
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
        specificVenue: selectedSportsArena,
        venueName: selectedSportsArenaData?.name || '',
        venueAddress: selectedSportsArenaData?.address || '',
        venuePrice: selectedPackagePrice.toString(),
        venuePackage: selectedPackage
      })
      router.push(`/create/services?${params.toString()}`)
    }
  }

  return (
    <div className="max-w-md mx-auto min-h-screen bg-gray-50">
      <StepHeader step={4} title="Choose Sports Arena" />
      <div className="p-6 space-y-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Select Your Sports Arena</h2>
          <p className="text-sm text-gray-600">Choose the perfect sports arena for your event</p>
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
            placeholder="Search sports arenas (e.g., basketball, Madison Square Garden)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-12 rounded-xl border border-gray-300 px-4 outline-none focus:ring-2 focus:ring-purple-300"
          />
        </div>

        <div className="space-y-3">
          {filteredSportsArenas.length > 0 ? (
            filteredSportsArenas.map(arena => (
              <SportsArenaCard
                key={arena.id}
                arena={arena}
                isSelected={selectedSportsArena === arena.id}
                onSelect={() => {
                  setSelectedSportsArena(arena.id)
                  // Reset package selection when changing arena
                  setSelectedPackage('')
                  setSelectedPackagePrice(0)
                }}
                selectedPackage={selectedSportsArena === arena.id ? selectedPackage : undefined}
                onPackageSelect={handlePackageSelect}
                guestCount={parseInt(guestCount) || 1}
              />
            ))
          ) : (
            <div className="bg-yellow-50 p-4 rounded-xl text-center">
              <div className="text-sm font-medium text-yellow-800 mb-2">🔍 No Sports Arenas Found</div>
              <div className="text-xs text-yellow-700">
                No sports arenas match your search criteria. Try adjusting your search terms.
              </div>
            </div>
          )}
        </div>

        <div className="bg-purple-50 p-4 rounded-xl">
          <div className="text-sm font-medium text-purple-800 mb-2">🏟️ Sports Arena Benefits</div>
          <div className="text-xs text-purple-700">
            Sports arena venues offer professional facilities, large capacity, and unique sporting atmospheres for your event.
          </div>
        </div>

        <Button onClick={next} disabled={!valid}>
          Continue to Services
        </Button>
      </div>
    </div>
  )
}

export default function SportsArenas() {
  return (
    <Suspense fallback={
      <div className="max-w-md mx-auto min-h-screen bg-gray-50">
        <div className="p-6">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-sm text-gray-600">Loading sports arenas...</p>
          </div>
        </div>
      </div>
    }>
      <SportsArenasContent />
    </Suspense>
  )
}